pipeline {
	agent { 
		docker { 
			image 'node:18-alpine3.15'			
		}
	}
	environment {
		HOME = "."
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

