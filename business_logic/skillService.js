/**
 * CAPA DE LÓGICA DE NEGOCIO (Business Logic Layer - BLL)
 * Archivo: /business_logic/skillService.js
 * 
 * Responsabilidad:
 * Actúa como intermediario orquestador entre la interfaz de usuario (Presentación)
 * y la fuente de datos (Acceso a Datos). Implementa las reglas de negocio,
 * validaciones de entrada, auditoría de trazabilidad entre capas,
 * cálculo de métricas de ingeniería (estimación de costos por token, horas ahorradas)
 * y normalización de modelos de dominio.
 * 
 * Regla Arquitectónica Estricta:
 * Esta capa NO toca ni conoce el DOM (document, window, HTML). Es 100% testeable de forma aislada.
 */

import { GeminiApiMock } from '../data_access/apiMock.js';

class GeminiSkillService {
  constructor() {
    // Almacenamiento en memoria para auditoría e historial de la sesión
    this.sessionHistory = [];
    this.pricingPer1kTokensUSD = {
      prompt: 0.000125,
      completion: 0.000375
    };
  }

  /**
   * Valida la solicitud antes de delegar a la capa de datos
   * @param {string} scenarioKey Identificador del preset
   * @param {string} customPrompt Texto escrito por el usuario
   */
  validateRequest(scenarioKey, customPrompt) {
    if (!scenarioKey && (!customPrompt || customPrompt.trim().length === 0)) {
      throw new Error("Regla de Negocio: Debe seleccionar una habilidad o ingresar una consulta de ingeniería válida.");
    }

    if (customPrompt && customPrompt.trim().length > 1000) {
      throw new Error("Regla de Negocio: La consulta supera el límite máximo permitido de 1,000 caracteres.");
    }

    return true;
  }

  /**
   * Orquesta la ejecución de la Skill de Gemini, calculando métricas de negocio
   * y documentando la traza de capas.
   * @param {string} scenarioKey Clave del escenario ('microservices', 'network', 'sql', 'testing')
   * @param {string} customPrompt Prompt opcional
   * @returns {Promise<Object>} Modelo de Dominio enriquecido
   */
  async executeSkill(scenarioKey, customPrompt = "") {
    // 1. Validar reglas de negocio
    this.validateRequest(scenarioKey, customPrompt);

    const startTime = performance.now();
    const traceId = `trace-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString().slice(-4)}`;

    try {
      // 2. Delegar a la Capa de Acceso a Datos (DAL)
      const rawResponse = await GeminiApiMock.requestGeminiSkill(scenarioKey, customPrompt);

      const endTime = performance.now();
      const executionTimeMs = Math.round(endTime - startTime);

      // 3. Aplicar Lógica de Negocio y Transformación de Dominio
      const { data } = rawResponse;
      const tokens = data.metrics.totalTokens;
      const promptTokens = data.metrics.promptTokens;
      const completionTokens = data.metrics.completionTokens;

      // Cálculo de costo estimado en USD
      const estimatedCostUSD = (
        (promptTokens / 1000) * this.pricingPer1kTokensUSD.prompt +
        (completionTokens / 1000) * this.pricingPer1kTokensUSD.completion
      ).toFixed(6);

      // Estimación de productividad para un Ingeniero Informático
      // Suponiendo un promedio de 45 a 90 minutos para diseñar manualmente cada componente
      const estimatedTimeSavedMinutes = Math.floor(Math.random() * 45) + 45;

      // Estructura del Modelo de Dominio listo para ser consumido por la Capa de Presentación
      const domainResult = {
        success: true,
        traceId: traceId,
        architectureTrace: [
          { layer: "Presentation (UI)", action: "Captura de evento de usuario", status: "COMPLETED" },
          { layer: "Business Logic (Service)", action: "Validación de entrada y normalización", status: "COMPLETED" },
          { layer: "Data Access (API Mock)", action: "Llamada asíncrona simulada a Gemini AI", status: "COMPLETED" },
          { layer: "Business Logic (Service)", action: "Cálculo de métricas de ingeniería y DTO", status: "COMPLETED" }
        ],
        modelInfo: {
          name: data.model,
          category: data.category,
          title: data.title
        },
        payload: {
          formattedContent: data.content,
          rawMarkdown: data.content
        },
        metrics: {
          latencyMs: executionTimeMs,
          promptTokens: promptTokens,
          completionTokens: completionTokens,
          totalTokens: tokens,
          estimatedCostUSD: `$${estimatedCostUSD} USD`,
          timeSavedEstimate: `${estimatedTimeSavedMinutes} minutos de desarrollo manual ahorrados`,
          efficiencyRating: "A+ (Optimizado)"
        },
        timestamp: new Date().toLocaleTimeString()
      };

      // Registrar en historial de auditoría de negocio
      this.sessionHistory.unshift(domainResult);

      return domainResult;

    } catch (error) {
      // Manejo y normalización de errores a nivel de negocio
      const failureTrace = {
        success: false,
        traceId: traceId,
        error: error.error || error.message || "Error inesperado al invocar la Skill de Gemini.",
        timestamp: new Date().toLocaleTimeString(),
        architectureTrace: [
          { layer: "Presentation (UI)", action: "Evento disparado", status: "COMPLETED" },
          { layer: "Business Logic (Service)", action: "Validación y Orquestación", status: "FAILED" },
          { layer: "Data Access (API Mock)", action: "Fallo de conexión o consulta", status: "ERROR" }
        ]
      };
      throw failureTrace;
    }
  }

  /**
   * Obtiene el catálogo de habilidades disponibles consultando el DAL
   * @returns {Promise<Array>}
   */
  async getSkillsCatalog() {
    return await GeminiApiMock.getAvailableSkills();
  }

  /**
   * Retorna el historial de ejecuciones de la sesión actual
   * @returns {Array}
   */
  getHistory() {
    return [...this.sessionHistory];
  }

  /**
   * Limpia el historial en memoria
   */
  clearHistory() {
    this.sessionHistory = [];
  }
}

// Exportamos una instancia única (Singleton) del servicio
export const skillService = new GeminiSkillService();
