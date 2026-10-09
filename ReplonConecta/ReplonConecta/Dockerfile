# Backend Repelon Conecta para Render (runtime: docker).
#
# Multi-stage: Maven 3.9 + JDK 17 compilan el jar, y una imagen JRE minima
# lo corre. Render inyecta el puerto en PORT (la app lo lee en
# application.properties) y no hace falta EXPOSE ni cambiar el CMD.

FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
# Primero solo el pom: la capa de dependencias se cachea mientras no cambie.
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/RepelonConecta-0.0.1-SNAPSHOT.jar app.jar
CMD ["java", "-jar", "app.jar"]
