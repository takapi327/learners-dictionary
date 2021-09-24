import { WebClient } from '@slack/web-api';
import AWS           from 'aws-sdk';
import ECS           from 'aws-sdk/clients/ecs';

const web = new WebClient(process.env.SLACK_API_TOKEN);
const ecs = new AWS.ECS({region: 'ap-northeast-1'});

const DOCKER_IMAGE_PATH = process.env.DOCKER_IMAGE_PATH
const CLUSTER_NAME      = process.env.CLUSTER_NAME
const TARGET_GROUP_ARN  = process.env.TARGET_GROUP_ARN

const TASK_NAME:      string = 'task-for-cap'
const CONTAINER_NAME: string = 'container-for-cap'
const SERVICE_NAME:   string = 'container-for-cap-service'
const LAUNCH_TYPE:    string = 'FARGATE'
const PORT_NUMBER:    number = 9000
const DESIRED_COUNT:  number = 1

exports.handler = async(event: any) => {  

  const decodeMessage     = decodeURIComponent(event.body).replace("payload=", "")
  const jsonDecodeMessage = JSON.parse(JSON.parse(JSON.stringify(decodeMessage)))
  const actions           = jsonDecodeMessage.actions[0]
  const dockerImageTag    = actions.value


  /** TaskDefinition Settings */
  /**
   * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2337
   */
  const PortMapping: ECS.PortMapping = {
    containerPort: PORT_NUMBER,
    hostPort:      PORT_NUMBER,
    protocol:      'tcp'
  }

  /**
   * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2200
   */
  const LogConfiguration: ECS.LogConfiguration = {
    logDriver: 'awslogs',
    options:   {
      'awslogs-group':         '/ecs/task-for-cap',
      'awslogs-region':        'ap-northeast-1',
      'awslogs-stream-prefix': 'ecs'
    }
  }

  /**
   * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L734
   */
  const ContainerDefinition: ECS.ContainerDefinition = {
    name:             CONTAINER_NAME,
    image:            `${DOCKER_IMAGE_PATH}:${dockerImageTag}`,
    portMappings:     [ PortMapping ],
    logConfiguration: LogConfiguration
  }

  /**
   * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2479
   */
  const RegisterTaskDefinitionRequest: ECS.RegisterTaskDefinitionRequest = {
    family:                  TASK_NAME,
    taskRoleArn:             'arn:aws:iam::445682127642:role/AWS-ECS-Task-Role',
    executionRoleArn:        'arn:aws:iam::445682127642:role/ecsTaskExecutionRole',
    networkMode:             'awsvpc',
    containerDefinitions:    [ ContainerDefinition ],
    requiresCompatibilities: [ LAUNCH_TYPE ],
    cpu:                     '1024',
    memory:                  '2048'
  }

  /** ECS Service Settings */
  /**
   * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2181
   */
  const LoadBalancer: ECS.LoadBalancer = {
    targetGroupArn: TARGET_GROUP_ARN,
    containerName:  CONTAINER_NAME,
    containerPort:  PORT_NUMBER
  }

  /**
   * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L522
   */
  const AwsVpcConfiguration: ECS.AwsVpcConfiguration = {
    subnets:        ['subnet-017bbf850d4e415f0', 'subnet-02ee6d751ce35c6c5'],
    securityGroups: ['sg-0fb416a95b2346f37'],
    assignPublicIp: 'ENABLED'
  }

  /**
   * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2278
   */
  const NetworkConfiguration: ECS.NetworkConfiguration = {
    awsvpcConfiguration: AwsVpcConfiguration
  }

  /**
   * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2594
   */
  const RunTaskRequest: ECS.RunTaskRequest = {
    taskDefinition:       TASK_NAME,
    cluster:              CLUSTER_NAME,
    count:                DESIRED_COUNT,
    networkConfiguration: NetworkConfiguration,
    launchType:           LAUNCH_TYPE
  }

  /**
   * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L1093
   */
  const CreateServiceRequest: ECS.CreateServiceRequest = {
    cluster:              CLUSTER_NAME,
    serviceName:          SERVICE_NAME,
    taskDefinition:       TASK_NAME,
    loadBalancers:        [ LoadBalancer ],
    launchType:           LAUNCH_TYPE,
    desiredCount:         DESIRED_COUNT,
    networkConfiguration: NetworkConfiguration
  }

  /**
   * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L3568
   */
  const UpdateServiceRequest: ECS.UpdateServiceRequest = {
    cluster:              CLUSTER_NAME,
    service:              SERVICE_NAME,
    desiredCount:         DESIRED_COUNT,
    taskDefinition:       TASK_NAME,
    networkConfiguration: NetworkConfiguration
  }

  /** Slack message settings */
  const params = { 
    channel:     process.env.SLACK_CHANNEL!,
    ts:          jsonDecodeMessage.message_ts,
    text:        '',
    attachments: [
      {
        'text': ''
      }
    ]
  }

  if(actions.name == 'Deploy') {
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3caimport { WebClient } from '@slack/web-api';
     import AWS           from 'aws-sdk';
     import ECS           from 'aws-sdk/clients/ecs';

     const web = new WebClient(process.env.SLACK_API_TOKEN);
     const ecs = new AWS.ECS({region: 'ap-northeast-1'});

     const DOCKER_IMAGE_PATH = process.env.DOCKER_IMAGE_PATH
     const CLUSTER_NAME      = process.env.CLUSTER_NAME
     const TARGET_GROUP_ARN  = process.env.TARGET_GROUP_ARN

     const TASK_NAME:      string = 'task-for-cap'
     const CONTAINER_NAME: string = 'container-for-cap'
     const SERVICE_NAME:   string = 'container-for-cap-service'
     const LAUNCH_TYPE:    string = 'FARGATE'
     const PORT_NUMBER:    number = 9000
     const DESIRED_COUNT:  number = 1

     exports.handler = async(event: any) => {

  const decodeMessage     = decodeURIComponent(event.body).replace("payload=", "")
  const jsonDecodeMessage = JSON.parse(JSON.parse(JSON.stringify(decodeMessage)))
  const actions           = jsonDecodeMessage.actions[0]
  const dockerImageTag    = actions.value


  /** TaskDefinition Settings */
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2337
     */
    const PortMapping: ECS.PortMapping = {
      containerPort: PORT_NUMBER,
      hostPort:      PORT_NUMBER,
      protocol:      'tcp'
    }

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2200
     */
    const LogConfiguration: ECS.LogConfiguration = {
      logDriver: 'awslogs',
      options:   {
        'awslogs-group':         '/ecs/task-for-cap',
        'awslogs-region':        'ap-northeast-1',
        'awslogs-stream-prefix': 'ecs'
      }
    }

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L734
     */
    const ContainerDefinition: ECS.ContainerDefinition = {
      name:             CONTAINER_NAME,
      image:            `${DOCKER_IMAGE_PATH}:${dockerImageTag}`,
      portMappings:     [ PortMapping ],
      logConfiguration: LogConfiguration
    }

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2479
     */
    const RegisterTaskDefinitionRequest: ECS.RegisterTaskDefinitionRequest = {
      family:                  TASK_NAME,
      taskRoleArn:             'arn:aws:iam::445682127642:role/AWS-ECS-Task-Role',
      executionRoleArn:        'arn:aws:iam::445682127642:role/ecsTaskExecutionRole',
      networkMode:             'awsvpc',
      containerDefinitions:    [ ContainerDefinition ],
      requiresCompatibilities: [ LAUNCH_TYPE ],
      cpu:                     '1024',
      memory:                  '2048'
    }

    /** ECS Service Settings */
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2181
     */
    const LoadBalancer: ECS.LoadBalancer = {
      targetGroupArn: TARGET_GROUP_ARN,
      containerName:  CONTAINER_NAME,
      containerPort:  PORT_NUMBER
    }

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L522
     */
    const AwsVpcConfiguration: ECS.AwsVpcConfiguration = {
      subnets:        ['subnet-017bbf850d4e415f0', 'subnet-02ee6d751ce35c6c5'],
      securityGroups: ['sg-0fb416a95b2346f37'],
      assignPublicIp: 'ENABLED'
    }

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2278
     */
    const NetworkConfiguration: ECS.NetworkConfiguration = {
      awsvpcConfiguration: AwsVpcConfiguration
    }

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2594
     */
    const RunTaskRequest: ECS.RunTaskRequest = {
      taskDefinition:       TASK_NAME,
      cluster:              CLUSTER_NAME,
      count:                DESIRED_COUNT,
      networkConfiguration: NetworkConfiguration,
      launchType:           LAUNCH_TYPE
    }

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L1093
     */
    const CreateServiceRequest: ECS.CreateServiceRequest = {
      cluster:              CLUSTER_NAME,
      serviceName:          SERVICE_NAME,
      taskDefinition:       TASK_NAME,
      loadBalancers:        [ LoadBalancer ],
      launchType:           LAUNCH_TYPE,
      desiredCount:         DESIRED_COUNT,
      networkConfiguration: NetworkConfiguration
    }

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L3568
     */
    const UpdateServiceRequest: ECS.UpdateServiceRequest = {
      cluster:              CLUSTER_NAME,
      service:              SERVICE_NAME,
      desiredCount:         DESIRED_COUNT,
      taskDefinition:       TASK_NAME,
      networkConfiguration: NetworkConfiguration
    }

    /** Slack message settings */
    const params = {
      channel:     process.env.SLACK_CHANNEL!,
      ts:          jsonDecodeMessage.message_ts,
      text:        '',
      attachments: [
        {
          'text': ''
        }
      ]
    }

    if(actions.name == 'Deploy') {
      /**
       * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L290
       */
      ecs.registerTaskDefinition(RegisterTaskDefinitionRequest, function(err, data) {
        if(err) console.log(`タスクの作成に失敗しました:${JSON.stringify(err)}`);
        else    console.log(`タスクの作成に成功しました:${JSON.stringify(data)}`);
      });

      /**
       * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L394
       */
      await ecs.updateService(UpdateServiceRequest, function(err, data) {
        if(err) console.log(`サービスの更新に失敗しました:${JSON.stringify(err)}`)
        else    console.log(`サービスの更新に成功しました:${JSON.stringify(data)}`)
      }).promise();

      params.attachments[0].text = 'イメージがアップされました'
    } else {
      params.attachments[0].text = 'キャンセルされました'
    }

    await web.chat.update(params).then((res) => {
      console.log(`イメージの更新を行いました:${JSON.stringify(res)}`)
    }).catch(console.error)
  }

  76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L290
     */
    ecs.registerTaskDefinition(RegisterTaskDefinitionRequest, function(err, data) {
      if(err) console.log(`タスクの作成に失敗しました:${JSON.stringify(err)}`);
      else    console.log(`タスクの作成に成功しました:${JSON.stringify(data)}`);
    });

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L394
     */
    await ecs.updateService(UpdateServiceRequest, function(err, data) {
       if(err) console.log(`サービスの更新に失敗しました:${JSON.stringify(err)}`)
       else    console.log(`サービスの更新に成功しました:${JSON.stringify(data)}`)
    }).promise();

    params.attachments[0].text = 'イメージがアップされました'
  } else {
    params.attachments[0].text = 'キャンセルされました'
  }

  await web.chat.update(params).then((res) => {
    console.log(`イメージの更新を行いました:${JSON.stringify(res)}`)
  }).catch(console.error)
}

