package com.debtflow.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI debtFlowOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("DebtFlow API")
                        .description("Sistema de Gestión de Cobranzas con Asistente Conversacional")
                        .version("1.0.0"));
    }
}