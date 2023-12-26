//Jenkins VARIABLES
// Jenkins agent name which we will add while setting up job for build in jenkins. This is very important and whole
// deployment would be done on machine associated with this jenkins agent
def JENKINS_AGENT='Clever_Chain_Stage'
// This server file must be placed at project root directory
def Server_File='server.js'
def CASSANDRA_ZIP_FILE = "cassandra_data.zip"
def ENV_ZIP_FILE = "env.zip"
def ENV_ZIP_FILE2 = "env2.zip"
def SERVER_ENV_FILE = "/var/lib/jenkins/workspace/Clever_Chain_Stage/env/.env"
def CLIENT_ENV_FILE = "/var/lib/jenkins/workspace/Clever_Chain_Stage/env/client/.env.dev"
def BATCH_ENV_FILE = "/var/lib/jenkins/batch_env/.env"


def CERT_PATH = "/var/lib/jenkins/workspace/Clever_Chain_Stage/packages/server/cassandra_data"
def Certificate_file='cleverchain.crt'
def Key_file='cleverchain_private.key'
def CASSANDRA_PATH = "/var/lib/jenkins/workspace/Clever_Chain_Stage/cassandra_data"
def SERVER_PATH = "/var/lib/jenkins/workspace/Clever_Chain_Stage/packages/server"
def CLIENT_PATH = "/var/lib/jenkins/workspace/Clever_Chain_Stage/packages/client"
def BATCH_PATH = "/var/lib/jenkins/workspace/Clever_Chain_Stage/packages/batch-engine"
def REPO_FOLDER = "/var/lib/jenkins/workspace/Clever_Chain_Stage"
def REPO_FOLDER_TMP = "/var/lib/jenkins/workspace/Clever_Chain_Stage@tmp"
// Fixed repo path, it will not be changed
def REPO_PATH = "/var/lib/jenkins/workspace/${env.JOB_NAME}";
// def Frontend_Repo_Path = "/var/lib/jenkins/workspace/angular_jenkins_sonar_pilot_project";
// Discord notification url. Change it only if required
def DICORD_WEBHOOK_URL = "https://discord.com/api/webhooks/904954275803856958/02Vj11P3KgyrwnJkVxZvr5Wd17RgcMTGvouNVOCBxtHpIb6Ij2SCKOCzxjJLgmJcmiuS"
def BUILD_STATUS=""
pipeline {
      agent { label "${JENKINS_AGENT}" }
    stages {
          stage('---------------------------------------------------------Installing Dependencies----------------------------------------') {
              steps {
                    script{

                        BUILD_STATUS = "STARTED"
                        echo 'killing existing runing process...'
                        sh "pkill node"
                        //TODO : to be added only if process exist
//                         sh "kill -9 \$(lsof -t -i:3000)"
//                         sh "kill -9 \$(lsof -t -i:3001)"


                        sh "echo \$(docker 2>&1) > docker_result";
                        def docker_result=readFile('docker_result')

                        echo 'Checking if docker installed : '

                        if (docker_result.contains("docker: not found"))
                        {
                        echo 'docker not installed....'
                        sh "sudo apt update"
                        sh "sudo -S apt install -y docker.io"
                        sh "docker -v"
                        sh "echo \$(docker 2>&1) > docker_result_install";

                        }
                        else {
                             echo 'docker installed....'
                        }
                        }
                        sh "sudo -S apt install unzip"
                        sh "sudo -S apt install awscli"

                        sh "sudo -S curl -fsSL https://deb.nodesource.com/setup_16.x | sudo bash -"
                        sh "sudo -S apt install -y nodejs"
                        sh "sudo -S npm install pm2 -g && pm2 update"


                        sh "sudo -S apt install -y nginx"
                        sh "node -v"
                        sh "npm -v"
                        //Clean the previous job folder
                        //sh "rm -rf '${REPO_FOLDER}'";
                        //sh "rm -rf '${REPO_FOLDER_TMP}'";
                       }

                }
//    stage('-----------------------------------------------------------------Sonarqube Analyses-------------------------------------------') {
//             steps {
//                 sh "npm install --save-dev jest supertest"
//                 sh "npm run test:client"
//                 //sh "echo TODO";
//
//
//             }
//             post {
//                 always {
//                 withSonarQubeEnv(installationName: 'sonarqube') {
//                    sh "npm install sonar-scanner"
//                    sh "npm run sonar-scanner -Dproject.settings=./sonar-project.properties"
//
//                 //sh "echo TODO";
//
//                  }
//                 }
//             }
//         }
       stage('----------------------------------------------------------------Launching Cassandra --------------------------------------------') {
            steps {
                script {
                   //def qualitygate = waitForQualityGate()
                   //echo "Quality gate Status***********, ${qualitygate.status}"

                   def repo_path = pwd()
                   echo "repo_path : ${repo_path}"
                   sh "cd '${repo_path}'"
                   sh "pwd"
                   dir("packages/client") {
                    sh "pwd"
                   }

                   //Copy Certificates from S3
                   sh "mkdir tmp"
                   dir("tmp") {
                     sh "aws s3 cp s3://cleverchain/'${CASSANDRA_ZIP_FILE}' ."
                     sh "aws s3 cp s3://cleverchain/'${ENV_ZIP_FILE}' ."
                     sh "unzip '${CASSANDRA_ZIP_FILE}' -d '${repo_path}'"
                     sh "unzip '/var/lib/jenkins/${ENV_ZIP_FILE2}' -d '${repo_path}'"
                   }
                   //sh "unzip '${CASSANDRA_DATA_FILE}' -d '${REPO_PATH}'"
                   sh "mkdir redis_data"
                   sh "mkdir '${CERT_PATH}'"
                  // sh "unzip '${CASSANDRA_DATA_FILE}' -d '${repo_path}'"
                   //sleep 300 // seconds
                   //Launch Cassandra and Redis
                   echo 'Launch Cassandra and Redis...'

                   sh "cd '${CASSANDRA_PATH}'"
                   sh "sudo -S docker-compose -f '${repo_path}'/cassandra_data/docker-compose.yml up -d"
                   echo 'Waiting 20 sec for cassandra to start'
                   sleep 20 // seconds
                   sh "cd '${repo_path}'"
                   sh "npm i"
                   //Copy certificates
                   sh "cp '${CASSANDRA_PATH}'/${Certificate_file} '${CERT_PATH}'"
                   sh "cp '${CASSANDRA_PATH}'/${Key_file} '${CERT_PATH}'"
                   //Copy env files
                   sh "cp '${SERVER_ENV_FILE}' '${SERVER_PATH}'"
                   sh "cp '${CLIENT_ENV_FILE}' '${repo_path}'/packages/client/environments"


                  }
                }

               }
      stage('-----------------------------------------------------------------Deploying Server-------------------------------------------') {
          steps {
                script {
                  //TODO
//                    sh "kill -9 \$(lsof -t -i:3000)"
//                    sh "kill -9 \$(lsof -t -i:3001)"

                   // create the public directory to store the export files temporarily
                   sh "mkdir /var/lib/jenkins/workspace/Clever_Chain_Stage/packages/server/src/public"
                   sh "mkdir /var/lib/jenkins/workspace/Clever_Chain_Stage/packages/batch-engine/uploads"

                   sh "npm run migrate"
                   //sh "cd '${repo_path}'"
                   sh "pm2 delete client server"
                   //sleep 10 // seconds
                   //sh "kill -9 \$(lsof -t -i:3000)"
                   //sh "kill -9 \$(lsof -t -i:3001)"

                   dir("packages/client") {
                      sh "export JENKINS_NODE_COOKIE=dontKillMe"
                      sh "export BUILD_ID=dontKillMe"
                      sh "JENKINS_NODE_COOKIE=dontKillMe npm run start:dev &"

                   }

                   dir("packages/server") {
                      sh "export JENKINS_NODE_COOKIE=dontKillMe"
                      sh "export BUILD_ID=dontKillMe"
                      sh "JENKINS_NODE_COOKIE=dontKillMe2 npm run dev &"
                   }


                  sh "cp -rf '${SERVER_PATH}'/cassandra_data '${BATCH_PATH}'/"
                  sh "cp '${BATCH_ENV_FILE}' '${REPO_FOLDER}'/packages/batch-engine/"

                   dir("packages/batch-engine") {
                      sh "export JENKINS_NODE_COOKIE=dontKillMe"
                      sh "export BUILD_ID=dontKillMe"
                      sh "JENKINS_NODE_COOKIE=dontKillMe2 npm run dev &"
                   }

                   sleep 20 // seconds
                  // sh "nohup npm run start-server:dev &"
                  // sleep 300 // seconds
                  // sh "cp ${Certificate_file} ${Key_file} '${CERT_PATH}'"
                   //launch the docker
                  // echo 'Launch Project docker and Redis...'
                   //sh "echo '${JENKINS_USER_PASSWORD}' | sudo -S docker-compose -f '${repo_path}'/docker-compose.yml up"

                    }
                  }
       }
     //  stage('----------------------------------------------------------------Building Project--------------------------------------------') {
         //   steps {
          //         sh "cd '${REPO_PATH}'"
          //         sh "pwd"
          //         sh 'npm install'
          //        }
       // }
      //  stage('-----------------------------------------------------------------Sonarqube Analyses-------------------------------------------') {
      //      steps {
      //          sh "npm install --save-dev jest supertest"
      //          sh "npm test"
      //      }
      //      post {
      //          always {
      //           withSonarQubeEnv(installationName: 'sonarqube') {
      //              sh "npm install sonar-scanner"
      //              sh "npm run sonar-scanner"
      //           }
      //          }
      //      }
     //   }
       // stage('-----------------------------------------------------------------Deploying Server-------------------------------------------') {
       //     steps {
       //         script {
       //            def qualitygate = waitForQualityGate()
       //            echo "Quality gate Status***********, ${qualitygate.status}"
       //            if (qualitygate.status == "OK") {
       //             sh "cd '${REPO_PATH}'"
        //            sh "pwd"
        //            sh "sudo pm2 delete server || : && sudo pm2 start ${Server_File} --name 'server'"
        //            sh "sudo pm2 ls"
        //            sh "exit"
         //          } else {
         //           error "Quality gate status failed, please read logs..."
          //         }
          //      }
           // }
       // }
        // stage('-----------------------------------------------------------------Deploying Frontend Build-------------------------------------------') {
        //     steps {
        //         script {

        //             sh "whoami"
        //             sh "cd '${Frontend_Repo_Path}'"
        //             sh "pm2 delete server || : && pm2 start ${Server_File} --name 'server'"
        //             sh "pm2 ls"
        //             sh "exit"
        //         }
        //     }
        // }

    }

     post {
       // only triggered when blue or green sign
       success {
         script{
           BUILD_STATUS="SUCCESS"
           }
           notifyDiscord(DICORD_WEBHOOK_URL,BUILD_STATUS)

       }
       // triggered when red sign
       failure {
         script{
            BUILD_STATUS="FAILED"
            }
            notifyDiscord(DICORD_WEBHOOK_URL,BUILD_STATUS)

       }
       unstable {
         script{
            BUILD_STATUS="UNSTABLE"
            }
            notifyDiscord(DICORD_WEBHOOK_URL,BUILD_STATUS)

       }
       aborted {
          script{
            BUILD_STATUS="ABORTED"
            }
            notifyDiscord(DICORD_WEBHOOK_URL,BUILD_STATUS)

       }

    }
}

def notifySlack(String buildStatus = '${BUILD_STATUS}') {
    // Build status of null means success.
    buildStatus = buildStatus ?: 'SUCCESS'

    def color

    if (buildStatus == 'STARTED') {
        color = '#D4DADF'
    } else if (buildStatus == 'SUCCESS') {
        color = '#BDFFC3'
    } else if (buildStatus == 'UNSTABLE') {
        color = '#FFFE89'
    } else {
        color = '#FF9FA1'
    }

    def msg = "${buildStatus}: `${env.JOB_NAME}` #${env.BUILD_NUMBER}:\n${env.BUILD_URL}"

    slackSend(color: color, message: msg,baseUrl:"https://hooks.slack.com/services/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",
    channel:"#sonar-jenkins-build-notifications",botUser:true)
}

def notifyDiscord(String discordWebhookUrl,String buildStatus) {
    // Build status of null means success.
    buildStatus = buildStatus ?: 'SUCCESS'
    def isBuildUnstable
    def isBuildSuccessful
    def msg =""
   echo "Build Status=====${buildStatus}"
    if (buildStatus == 'STARTED') {
        isBuildSuccessful= false
        isBuildUnstable=false
    } else if (buildStatus == 'SUCCESS') {
        echo "evn data log***********, ${env}"
        isBuildSuccessful= true
        isBuildUnstable=false
        msg = "Build # ${env.BUILD_NUMBER} ${buildStatus} for Job `${env.JOB_NAME}` \n Build Url: ${env.BUILD_URL}console"
    } else if (buildStatus == 'UNSTABLE' || buildStatus == 'ABORTED') {
        isBuildSuccessful= false
        isBuildUnstable=true
        msg = "Build # ${env.BUILD_NUMBER} ${buildStatus} for Job `${env.JOB_NAME}` :\n Error Logs: ${env.BUILD_URL}console \n Build Url: ${env.BUILD_URL}"
    } else {
        isBuildSuccessful= false
        isBuildUnstable=false
        msg = "Build # ${env.BUILD_NUMBER} ${buildStatus} for Job `${env.JOB_NAME}` :\n Error Logs: ${env.BUILD_URL}console \n Build Url: ${env.BUILD_URL}"
    }



    discordSend (
                   title: msg,
                  footer: "",
                  unstable: isBuildUnstable,
                  successful: isBuildSuccessful,
                  webhookURL:discordWebhookUrl )
}
