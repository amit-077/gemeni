const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyBQOAcHERhS6kIUmq3FlfqDeLHNMWZNrTQ");

async function run(userPrompt) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt =
    "Act as a professional prompt engineer. I want you to modify my prompt so that chatgpt can give me most accurate and most favourable answer that I want. Use advance prompt engineering techniques and modify the prompt given below. Just give the modified prompt and not anything else. Give it in a single paragraph and not in points. You have to just modify the prompt, the meaning of the prompt should not be changed. Below is the prompt. Only give the modified prompt not other things, not even any title nor anything, just the modified prompt." +
    userPrompt;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  console.log(text);
  return text;
}

app.get("/", (req, res) => {
  res.send("App Running");
});

app.post("/generate", async (req, res) => {
  try {
    let { prompt } = req.body;
    console.log(prompt);
    let answer = await run(prompt);
    console.log(answer);
    res.status(200).send(JSON.stringify(answer));
  } catch (e) {
    console.log(e);
  }
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
