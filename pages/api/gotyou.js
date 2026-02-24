//api simples que retorna o texto "sabia que você podia fazer requisições, agora que sei que esta mentindo podemos trabalhar melhor ?"
//adicionar cors e headers para permitir requisições de outros domínios
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  res.status(200).json({ message: "Sabia que você podia fazer requisições? Agora que sei que está mentindo, podemos trabalhar melhor?" });
}