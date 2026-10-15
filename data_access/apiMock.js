/**
 * CAPA DE ACCESO A DATOS (Data Access Layer - DAL)
 * Archivo: /data_access/apiMock.js
 * 
 * Responsabilidad:
 * Simular la capa de infraestructura/comunicación con la API externa de Google Gemini AI.
 * Implementa llamadas asíncronas con promesas, simulación de latencia de red,
 * manejo de códigos de estado HTTP y persistencia/repositorio en memoria de respuestas.
 */

// Repositorio de respuestas pre-configuradas para escenarios de Ingeniería Informática
const GEMINI_KNOWLEDGE_BASE = {
  microservices: {
    category: "Arquitectura de Software y Cloud Computing",
    title: "Diseño de Microservicio de Autenticación en Go & Docker",
    model: "gemini-1.5-pro-latest",
    content: `### Solución Arquitectónica: Microservicio Resiliente en Go

\`\`\`go
package main

import (
    "context"
    "fmt"
    "net/http"
    "time"
    "github.com/golang-jwt/jwt/v5"
)

// AuthService maneja la generación de tokens criptográficos
type AuthService struct {
    secretKey []byte
}

func (s *AuthService) GenerateToken(userID string) (string, error) {
    claims := jwt.MapClaims{
        "sub": userID,
        "exp": time.Now().Add(time.Hour * 24).Unix(),
        "iat": time.Now().Unix(),
        "iss": "gemini-auth-service",
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(s.secretKey)
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        w.Write([]byte("{\\"status\\":\\"healthy\\", \\"engine\\":\\"Gemini-Skill-AI\\"}"))
    })
    
    server := &http.Server{
        Addr:         ":8080",
        Handler:      mux,
        ReadTimeout:  5 * time.Second,
        WriteTimeout: 10 * time.Second,
    }
    fmt.Println("[Gemini Skill] Microservicio escuchando en puerto :8080...")
    server.ListenAndServe()
}
\`\`\`

#### Consideraciones de Infraestructura (Dockerfile multi-stage):
1. **Compilación ligera:** Uso de \`golang:1.22-alpine\` para el build y \`scratch\` o \`alpine:latest\` en runtime.
2. **Seguridad:** Ejecución con usuario no-root (\`UID 10001\`) y flags de compilación \`-ldflags="-w -s"\`.
3. **Métricas y Telemetría:** Exposición de métricas Prometheus en \`/metrics\`.`,
    metrics: {
      promptTokens: 142,
      completionTokens: 388,
      totalTokens: 530,
      latencyMs: 820
    }
  },

  network: {
    category: "Redes, Seguridad y Sistemas Operativos",
    title: "Hardening de Servidor Linux y Configuración de Firewall (UFW / iptables)",
    model: "gemini-1.5-flash-latest",
    content: `### Script de Configuración y Seguridad Perimetral para DMZ

\`\`\`bash
#!/usr/bin/env bash
# ==============================================================================
# Script generado por Gemini Skill: Hardening de Red & Filtrado de Paquetes
# ==============================================================================
set -euo pipefail

echo "[+] Configurando políticas por defecto para UFW (Uncomplicated Firewall)..."
sudo ufw default deny incoming
sudo ufw default allow outgoing

echo "[+] Habilitando puertos de servicio estrictos..."
# Puerto SSH seguro (cambiado por defecto a 2222)
sudo ufw limit 2222/tcp comment "SSH con rate-limiting anti brute-force"

# Servicios Web (HTTP / HTTPS con TLS 1.3)
sudo ufw allow 80/tcp comment "Redirección HTTP a HTTPS"
sudo ufw allow 443/tcp comment "HTTPS Seguro"

# Bloqueo explícito de escaneos ICMP anómalos vía sysctl
echo "[+] Optimizando parámetros del kernel en /etc/sysctl.d/99-gemini-security.conf"
cat <<EOF | sudo tee /etc/sysctl.d/99-gemini-security.conf
net.ipv4.conf.all.rp_filter=1
net.ipv4.icmp_echo_ignore_broadcasts=1
net.ipv4.tcp_syncookies=1
EOF

sudo sysctl -p /etc/sysctl.d/99-gemini-security.conf
sudo ufw --force enable
echo "[✓] Hardening de red completado exitosamente con Gemini Skill."
\`\`\`

#### Recomendaciones de Ingeniería:
- Implementar **Fail2Ban** monitorizando los logs de autenticación en \`/var/log/auth.log\`.
- Deshabilitar el acceso directo de root vía SSH en \`/etc/ssh/sshd_config\`.`,
    metrics: {
      promptTokens: 110,
      completionTokens: 340,
      totalTokens: 450,
      latencyMs: 650
    }
  },

  sql: {
    category: "Bases de Datos & Optimización de Consultas",
    title: "Optimización de Consulta de Alta Carga e Indexación B-Tree Compuesta",
    model: "gemini-1.5-pro-latest",
    content: `### Diagnóstico del Plan de Ejecución (EXPLAIN ANALYZE)

La consulta original realizaba un **Sequential Scan** sobre 2.5 millones de registros en la tabla \`transacciones\`, generando cuellos de botella de E/S.

\`\`\`sql
-- Consulta Optimizada con Gemini Skill
EXPLAIN ANALYZE
SELECT 
    t.id_transaccion,
    t.monto,
    t.fecha_creacion,
    u.email
FROM transacciones t
INNER JOIN usuarios u ON u.id_usuario = t.id_usuario
WHERE t.estado = 'PROCESADA'
  AND t.fecha_creacion >= NOW() - INTERVAL '30 days'
ORDER BY t.fecha_creacion DESC
LIMIT 50;

-- Creación del Índice Óptimo Sugerido (Index Only Scan)
CREATE INDEX CONCURRENTLY idx_transacciones_estado_fecha_usuario 
ON transacciones (estado, fecha_creacion DESC) 
INCLUDE (monto, id_usuario);
\`\`\`

#### Impacto Estimado:
- **Costo de ejecución:** Reducción de **8,450 ms** a **14 ms** (~99.8% más veloz).
- **Consumo de memoria:** De búferes masivos a escaneo de páginas ordenadas en caché.`,
    metrics: {
      promptTokens: 135,
      completionTokens: 295,
      totalTokens: 430,
      latencyMs: 710
    }
  },

  testing: {
    category: "Calidad de Software (QA) & Testing Automatizado",
    title: "Generación de Suite de Pruebas Unitarias e Integración (Jest / Supertest)",
    model: "gemini-1.5-flash-latest",
    content: `### Suite de Pruebas Automatizadas para Endpoint Crítico

\`\`\`javascript
// authService.spec.js - Generado por Gemini Skill
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authenticateUser, generateAuthToken } from '../src/authService.js';
import { UserRepository } from '../src/repositories/userRepository.js';

describe('Skill de Validación: Autenticación de Usuarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe emitir un token JWT válido cuando las credenciales son correctas', async () => {
    // Arrange
    const mockUser = { id: 'usr-101', email: 'estudiante@universidad.edu.co', active: true };
    vi.spyOn(UserRepository, 'findByEmail').mockResolvedValue(mockUser);
    vi.spyOn(UserRepository, 'verifyPassword').mockResolvedValue(true);

    // Act
    const result = await authenticateUser('estudiante@universidad.edu.co', 'PasswordSeguro!2026');

    // Assert
    expect(result).toHaveProperty('token');
    expect(result.user.id).toBe('usr-101');
    expect(result.expiresIn).toBe(86400);
  });

  it('debe arrojar error 401 si la cuenta se encuentra suspendida', async () => {
    const mockUser = { id: 'usr-102', email: 'bloqueado@uni.edu', active: false };
    vi.spyOn(UserRepository, 'findByEmail').mockResolvedValue(mockUser);

    await expect(authenticateUser('bloqueado@uni.edu', 'pass'))
      .rejects
      .toThrow('Cuenta inactiva por políticas de seguridad.');
  });
});
\`\`\`

#### Cobertura Asegurada:
- Branches: 100% | Statements: 98% | Path Coverage: Positivos y Bordes de Excepción.`,
    metrics: {
      promptTokens: 128,
      completionTokens: 360,
      totalTokens: 488,
      latencyMs: 780
    }
  }
};

/**
 * Cliente de simulación de acceso a datos para la API de Gemini
 */
export const GeminiApiMock = {
  /**
   * Realiza una petición asíncrona simulada al backend de Gemini AI.
   * @param {string} scenarioClave Clave del escenario seleccionado ('microservices', 'network', 'sql', 'testing', etc.)
   * @param {string} [customPrompt] Prompt personalizado si el usuario escribe uno propio
   * @returns {Promise<Object>} Promesa que resuelve la respuesta estructurada estilo API REST
   */
  async requestGeminiSkill(scenarioClave, customPrompt = "") {
    // Simulación de latencia de red variable (entre 600ms y 1100ms)
    const simulatedLatency = Math.floor(Math.random() * 500) + 600;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validación básica de capa de datos (simulación de rechazo 400 Bad Request)
        if (!scenarioClave && !customPrompt.trim()) {
          reject({
            status: 400,
            statusText: "Bad Request",
            error: "Debe especificar un escenario válido o proporcionar un prompt de ingeniería."
          });
          return;
        }

        // Si es un prompt personalizado no contemplado en los presets
        if (customPrompt && (!scenarioClave || scenarioClave === "custom")) {
          const wordsCount = customPrompt.trim().split(/\s+/).length;
          const dynamicResult = {
            status: 200,
            statusText: "OK",
            timestamp: new Date().toISOString(),
            headers: {
              "content-type": "application/json",
              "x-goog-gemini-skill-version": "2.4.0-academic",
              "x-response-time-ms": simulatedLatency
            },
            data: {
              id: `gemini-resp-${Date.now()}`,
              model: "gemini-1.5-pro-academic",
              category: "Ingeniería Informática / Asistente Especializado",
              title: `Análisis y Resolución para: "${customPrompt.slice(0, 45)}..."`,
              content: `### Diagnóstico de Ingeniería Generado por Gemini Skill

Has consultado: *"${customPrompt.trim()}"*

\`\`\`markdown
[Fase 1: Análisis de Requisitos]
- Dominio técnico: Ciencias de la Computación / Arquitectura de Software
- Viabilidad técnica: Alta
- Restricciones detectadas: Seguridad, Escalabilidad horizontal y Mantenibilidad

[Fase 2: Recomendación de la Skill]
1. Aplicar desacoplamiento mediante interfaces y patrones creacionales (Factory / Dependency Injection).
2. Aislar la capa de persistencia mediante repositorios con contratos bien definidos.
3. Incorporar telemetría y trazabilidad distribuida (OpenTelemetry / Jaeger).
\`\`\`

\`\`\`bash
# Script de aprovisionamiento rápido recomendado
mkdir -p internal/{domain,service,repository} cmd/api
echo "Entorno estructurado según buenas prácticas de Ingeniería Informática."
\`\`\`

*Respuesta contextualizada por el modelo semántico para proyectos de ingeniería.*`,
              metrics: {
                promptTokens: wordsCount * 4,
                completionTokens: 280,
                totalTokens: (wordsCount * 4) + 280,
                latencyMs: simulatedLatency
              }
            }
          };
          resolve(dynamicResult);
          return;
        }

        // Si existe en el catálogo de presets
        const foundScenario = GEMINI_KNOWLEDGE_BASE[scenarioClave];
        if (foundScenario) {
          resolve({
            status: 200,
            statusText: "OK",
            timestamp: new Date().toISOString(),
            headers: {
              "content-type": "application/json",
              "x-goog-gemini-skill-version": "2.4.0-academic",
              "x-response-time-ms": simulatedLatency
            },
            data: {
              id: `gemini-resp-${Date.now()}`,
              model: foundScenario.model,
              category: foundScenario.category,
              title: foundScenario.title,
              content: foundScenario.content,
              metrics: {
                ...foundScenario.metrics,
                latencyMs: simulatedLatency
              }
            }
          });
        } else {
          // Escenario no encontrado (404 Not Found)
          reject({
            status: 404,
            statusText: "Not Found",
            error: `El escenario "${scenarioClave}" no se encuentra catalogado en la base de conocimiento de la Skill.`
          });
        }
      }, simulatedLatency);
    });
  },

  /**
   * Obtiene la lista de capacidades y categorías disponibles
   * @returns {Promise<Array>}
   */
  async getAvailableSkills() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "microservices", name: "Microservicios & Cloud (Go/Docker)", icon: "code" },
          { id: "network", name: "Redes & Hardening Linux (UFW)", icon: "shield" },
          { id: "sql", name: "Optimización SQL & B-Tree", icon: "database" },
          { id: "testing", name: "QA & Testing Automatizado", icon: "check-circle" }
        ]);
      }, 150);
    });
  }
};
