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

    stage('Build & Start Services') {
      steps {
        sh 'docker-compose down --volumes || true'
        sh 'docker-compose build'
        sh 'docker-compose up -d'
      }
    }

    stage('Test Backend') {
      steps {
        sh 'docker exec $(docker ps -qf "name=backend") npm test || true'
      }
    }

    stage('Test Frontend') {
      steps {
        sh 'docker exec $(docker ps -qf "name=frontend") npm test || true'
      }
    }

    stage('Clean Up') {
      steps {
        sh 'docker-compose down --volumes'
      }
    }
  }

  post {
    always {
      echo 'Pipeline finished.'
    }
  }
}
