/**
 * Marcador de posición para el futuro asistente (chatbot / IA).
 *
 * Mantiene el módulo aislado del flujo de reportes para poder integrar
 * conversación o APIs externas sin acoplar lógica al resto del dashboard.
 */
const ChatbotPlaceholder = () => {
  return (
    <section className="panel">
      <h2>Asistente virtual</h2>
      <div className="chatbot-placeholder">
        <strong>Introducción de IA más adelante</strong>
        <p className="helper-text">
          Este espacio queda desacoplado para integrar un chatbot sin afectar los módulos actuales.
        </p>
      </div>
    </section>
  );
};

export default ChatbotPlaceholder;
