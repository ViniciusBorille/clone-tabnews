function Home() {
  // Estilo para o container principal (centralização vertical e horizontal)
  const containerStyle = {
    display: "flex",
    justifyContent: "center", // Centraliza horizontalmente
    alignItems: "center", // Centraliza verticalmente
    minHeight: "100vh", // Garante a altura total da viewport
    backgroundColor: "#F7F7F7", // Cor de fundo clara (cinza muito suave)
    margin: 0,
    padding: 0,
  };

  // Estilo para o título (apenas para garantir que o texto esteja centralizado em relação a ele mesmo, se necessário)
  const headingStyle = {
    color: "#333", // Cor de texto escura para contraste
    textAlign: "center",
    padding: "20px", // Espaçamento interno opcional
  };
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Em desenvolvimento!</h1>
      <p>Novidades em breve!!</p>
    </div>
  );
}

export default Home;
