pipeline {
	agent { docker { image 'node:18-alpine3.15' } }
	stages {
		stage('log version info') {
			steps {
				sh 'pwd'
				sh 'ls'
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

