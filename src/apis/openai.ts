import api from "./request";

export const fetchData = async (prompt: any) => {
  try {
    const res = await api.post('https://api.openai.com/v1/completions', {
      prompt,
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 3000, // 根据需要，可能需要调整生成的文本长度
      temperature: 0.6, // 可以调整创造性
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
};