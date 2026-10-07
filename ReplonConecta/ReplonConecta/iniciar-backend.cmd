@echo off
cd /d "%~dp0"
call .\mvnw.cmd -q org.codehaus.mojo:exec-maven-plugin:3.5.0:java -Dexec.mainClass=com.repelonconecta.RepelonConecta.RepelonConectaApplication -Dexec.classpathScope=test -Dspring.profiles.active=test > .run-backend.log 2>&1
