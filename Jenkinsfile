pipeline {
	agent { docker { image 'node:18-alpine3.15' } }
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
				sh 'mkdir /.npm'			
				sh 'npm install'

			}
		}
	}	
}

