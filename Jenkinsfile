pipeline {
	agent { 
		docker { 
			image 'node:18-alpine3.15'
			args '-v /.npm:/home/jenkins/ -u root jenkins/jenkins'
			reuseNode true
		}
	}
	stages {
		stage('log version info') {
			steps {
				sh 'echo "ECHO PWD"'
				sh 'pwd'
				sh 'ls -la'
				sh 'node --version'
				sh 'npm --version'
			}
		}
		stage('install dependencies') {
			steps {
				sh 'npm install'
			}
		}
	}	
}

