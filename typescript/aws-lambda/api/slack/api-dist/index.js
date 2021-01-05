"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_api_1 = require("@slack/web-api");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const web = new web_api_1.WebClient(process.env.SLACK_API_TOKEN);
const ecs = new aws_sdk_1.default.ECS({ region: 'ap-northeast-1' });
const DOCKER_IMAGE_PATH = process.env.DOCKER_IMAGE_PATH;
const CLUSTER_NAME = process.env.CLUSTER_NAME;
const TARGET_GROUP_ARN = process.env.TARGET_GROUP_ARN;
const TASK_NAME = 'task-for-cap';
const CONTAINER_NAME = 'container-for-cap';
const SERVICE_NAME = 'container-for-cap-service';
const LAUNCH_TYPE = 'FARGATE';
const PORT_NUMBER = 9000;
const DESIRED_COUNT = 1;
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeMessage = decodeURIComponent(event.body).replace("payload=", "");
    const jsonDecodeMessage = JSON.parse(JSON.parse(JSON.stringify(decodeMessage)));
    const actions = jsonDecodeMessage.actions[0];
    const dockerImageTag = actions.value;
    /** TaskDefinition Settings */
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2337
     */
    const PortMapping = {
        containerPort: PORT_NUMBER,
        hostPort: PORT_NUMBER,
        protocol: 'tcp'
    };
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2200
     */
    const LogConfiguration = {
        logDriver: 'awslogs',
        options: {
            'awslogs-group': '/ecs/task-for-cap',
            'awslogs-region': 'ap-northeast-1',
            'awslogs-stream-prefix': 'ecs'
        }
    };
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L734
     */
    const ContainerDefinition = {
        name: CONTAINER_NAME,
        image: `${DOCKER_IMAGE_PATH}:${dockerImageTag}`,
        portMappings: [PortMapping],
        logConfiguration: LogConfiguration
    };
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2479
     */
    const RegisterTaskDefinitionRequest = {
        family: TASK_NAME,
        taskRoleArn: 'arn:aws:iam::445682127642:role/AWS-ECS-Task-Role',
        executionRoleArn: 'arn:aws:iam::445682127642:role/ecsTaskExecutionRole',
        networkMode: 'awsvpc',
        containerDefinitions: [ContainerDefinition],
        requiresCompatibilities: [LAUNCH_TYPE],
        cpu: '1024',
        memory: '2048'
    };
    /** ECS Service Settings */
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2181
     */
    const LoadBalancer = {
        targetGroupArn: TARGET_GROUP_ARN,
        containerName: CONTAINER_NAME,
        containerPort: PORT_NUMBER
    };
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L522
     */
    const AwsVpcConfiguration = {
        subnets: ['subnet-017bbf850d4e415f0', 'subnet-02ee6d751ce35c6c5'],
        securityGroups: ['sg-0fb416a95b2346f37'],
        assignPublicIp: 'ENABLED'
    };
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2278
     */
    const NetworkConfiguration = {
        awsvpcConfiguration: AwsVpcConfiguration
    };
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L2594
     */
    const RunTaskRequest = {
        taskDefinition: TASK_NAME,
        cluster: CLUSTER_NAME,
        count: DESIRED_COUNT,
        networkConfiguration: NetworkConfiguration,
        launchType: LAUNCH_TYPE
    };
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L1093
     */
    const CreateServiceRequest = {
        cluster: CLUSTER_NAME,
        serviceName: SERVICE_NAME,
        taskDefinition: TASK_NAME,
        loadBalancers: [LoadBalancer],
        launchType: LAUNCH_TYPE,
        desiredCount: DESIRED_COUNT,
        networkConfiguration: NetworkConfiguration
    };
    /**
     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L3568
     */
    const UpdateServiceRequest = {
        cluster: CLUSTER_NAME,
        service: SERVICE_NAME,
        desiredCount: DESIRED_COUNT,
        taskDefinition: TASK_NAME,
        networkConfiguration: NetworkConfiguration
    };
    /** Slack message settings */
    const params = {
        channel: process.env.SLACK_CHANNEL,
        ts: jsonDecodeMessage.message_ts,
        text: '',
        attachments: [
            {
                'text': ''
            }
        ]
    };
    if (actions.name == 'Deploy') {
        //ecs.registerTaskDefinition(RegisterTaskDefinitionRequest, function(err, data) {
        //  if(err) console.log(err); else console.log(data);
        //}).promise().then(taskDefinition => {
        //  console.log(`Finish creating the Taskdefinition = ${taskDefinition}`)
        //  /**
        //   * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L302
        //   */
        //  ecs.runTask(RunTaskRequest, function(err, data) {
        //    if(err) console.log(err); else console.log(data);
        //  }).promise().then(runTask => {
        //    console.log(`Task is now running = ${runTask}`)
        //    /**
        //     * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L34
        //     */
        //    ecs.createService(CreateServiceRequest, function(err, data) {
        //      if(err) console.log(err); else console.log(data);
        //    }).promise().then(ecsService => {
        //      console.log(`Created ECS services = ${ecsService}`)
        //      updateSlackMessage('イメージがアップされました')
        //    }).catch(error => {
        //      console.error(error)
        //      updateSlackMessage('サービスの作成に失敗しました')
        //    })
        //  }).catch(error => {
        //    console.log(error)
        //    updateSlackMessage('タスクの起動に失敗しました')
        //  })
        //}).catch(error => {
        //  console.log(error)
        //  updateSlackMessage('タスクの作成に失敗しました')
        //})
        /**
         * @SEE https://github.com/aws/aws-sdk-js/blob/1ad9d3ca76d56051e106fdf70f123a02047ebafe/clients/ecs.d.ts#L290
         */
        ecs.registerTaskDefinition(RegisterTaskDefinitionRequest, function (err, data) {
            if (err)
                console.log(`タスクの作成に失敗しました:${err}`);
            else
                console.log(`タスクの作成に成功しました:${data}`);
        });
        yield ecs.updateService(UpdateServiceRequest, function (err, data) {
            if (err)
                console.log(`サービスの更新に失敗しました:${err}`);
            else
                console.log(`サービスの更新に成功しました:${data}`);
        }).promise();
        params.attachments[0].text = 'イメージがアップされました';
    }
    else {
        params.attachments[0].text = 'キャンセルされました';
    }
    yield web.chat.update(params).catch(console.error);
});
