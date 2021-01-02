import { WebClient } from '@slack/web-api';
import AWS           from 'aws-sdk';
import ECS           from 'aws-sdk/clients/ecs';

const web = new WebClient(process.env.SLACK_API_TOKEN);
const ecs = new AWS.ECS({region: 'ap-northeast-1'});
 
exports.handler = async(event: any) => {  

  const decodeMessage     = decodeURIComponent(event.body).replace("payload=", "")
  const jsonDecodeMessage = JSON.parse(JSON.parse(JSON.stringify(decodeMessage)))

  var deployMessage: string = ''

  if(jsonDecodeMessage.actions[0].name == 'Deploy') {

    deployMessage = 'イメージがアップされました'

    const dkrImgaePath = '445682127642.dkr.ecr.ap-northeast-1.amazonaws.com/project/repository_for_cap'
    const dkrImgaeTag  = jsonDecodeMessage.actions[0].value
    //const dkrImgae = process.env.DOCKER_IMAGE_PATH

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2337
     */
    const PortMapping: ECS.PortMapping = {
      containerPort: 9000,
      hostPort:      9000,
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
      name:             'container-for-cap',
      image:            `${dkrImgaePath}:${dkrImgaeTag}`,
      portMappings:     [ PortMapping ],
      logConfiguration: LogConfiguration
    }

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2479
     */
    const RegisterTaskDefinitionRequest: ECS.RegisterTaskDefinitionRequest = {
      family:                  'task-for-cap',
      executionRoleArn:        'arn:aws:iam::445682127642:role/ecsTaskExecutionRole',
      networkMode:             'awsvpc',
      containerDefinitions:    [ ContainerDefinition ],
      requiresCompatibilities: [ 'FARGATE' ],
      cpu:                     '1024',
      memory:                  '2048'
    }

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2594
     */
    const RunTaskRequest: ECS.RunTaskRequest = {
      taskDefinition: 'task-for-cap'
    }

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2181
     */
    const LoadBalancer: ECS.LoadBalancer = {
      targetGroupArn:   'arn:aws:elasticloadbalancing:ap-northeast-1:445682127642:targetgroup/EC2Co-Defau-UROKCCHNILDA/d9103f1085420b0d',
      loadBalancerName: 'EC2Co-EcsEl-8B6PYIWIS2FE',
      containerName:    'container-for-cap',
      containerPort:    9000
    }

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L1093
     */
    const CreateServiceRequest: ECS.CreateServiceRequest = {
      cluster:        'cluster-for-cap',
      serviceName:    'container-for-cap-service',
      taskDefinition: 'task-for-cap',
      loadBalancers:  [ LoadBalancer ],
      launchType:     'FARGATE'
    }

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L290
     */
    ecs.registerTaskDefinition(RegisterTaskDefinitionRequest).promise().then(taskDefinition => {

      console.log(`Finish creating the Taskdefinition = ${taskDefinition}`)

      ecs.runTask(RunTaskRequest).promise().then(runTask => {

        console.log(`Task is now running = ${runTask}`)

        ecs.createService(CreateServiceRequest).promise().then(ecsService => {
          console.log(`Created ECS services = ${ecsService}`)
        }).catch(error => {
          console.error(error)
          deployMessage = 'サービスの作成に失敗しました'
        })

      }).catch(error => {
        console.log(error)
        deployMessage = 'タスクの起動に失敗しました'
      })
    }).catch(error => {
      console.log(error)
      deployMessage = 'タスクの作成に失敗しました'
    })
  
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L302
     */
    //ecs.runTask(RunTaskRequest)

    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L34
     */
    //ecs.createService(CreateServiceRequest)

  } else {
    deployMessage = 'キャンセルされました'
  }
  
  const params = { 
    channel: process.env.SLACK_CHANNEL!,
    ts: jsonDecodeMessage.message_ts,
    text: '',
    attachments: [
      {
        'text': deployMessage
      }
    ]
  }

  await web.chat.update(params).catch(console.error)
}

