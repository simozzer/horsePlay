pipeline {
	agent { 
		docker { 
			image 'node:18-alpine3.15'
			reuseNode true
		}
	}
	stages {
		stage('log version info') {
			steps {
				sh 'pwd'
				sh 'ls -la'
				sh 'node --version'
				sh 'npm --version'
			}
		}
		stage('install dependencies') {
			steps {
				dir('/.npm') {			
					sh 'npm install'
				}

			}
		}
	}	
}

