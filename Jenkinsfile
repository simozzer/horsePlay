pipeline {
	agent { docker { image 'node:18-alpine3.15' } }
	steps {
		stage('log version info') {
			sh 'pwd'
			sh 'ls'
			sh 'node --version'
			sh 'npm --version'
		}
		stage('install dependencies') {
			sh 'npm install'
		}
	}	
}

