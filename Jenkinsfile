pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE_PATH = "${WORKSPACE}/docker-compose.yml"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/zakariaGit-hash/ToDoList.git', branch: 'main'
            }
        }
        
        stage('Fix Permissions') {
            steps {
                // Make sure scripts are executable before building
                sh 'find . -type f -name "*.sh" -exec chmod +x {} \\;'
                sh 'find ./frontend/node_modules/.bin -type f -exec chmod +x {} \\; || true'
                sh 'find ./backend/node_modules/.bin -type f -exec chmod +x {} \\; || true'
            }
        }
        
        stage('Build & Start Services') {
            steps {
                sh 'docker-compose down --volumes || true'
                sh 'docker-compose build'
                
                // Add debugging to see what's happening inside containers
                sh 'docker-compose up -d'
                sh 'sleep 10' // Wait for containers to fully start
                
                // Verify services are running
                sh 'docker ps'
            }
        }
        
        stage('Test Backend') {
            steps {
                script {
                    try {
                        sh 'docker exec $(docker ps -qf "name=backend") npm test'
                    } catch (Exception e) {
                        echo "Backend tests failed: ${e.message}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('Test Frontend') {
            steps {
                script {
                    try {
                        sh 'docker exec $(docker ps -qf "name=frontend") npm test'
                    } catch (Exception e) {
                        echo "Frontend tests failed: ${e.message}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('Clean Up') {
            steps {
                sh 'docker-compose down --volumes'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
        }
        always {
            echo 'Pipeline finished.'
        }
    }
}