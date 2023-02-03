
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: "org-5HTgHyTvAG7VmP2UkZCpJtng",
    apiKey: "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"
});
const openai = new OpenAIApi(configuration);
const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 3080;

app.post('/',  async (req, res) => {    
    const {message, currentmodel} = req.body;   
     const response = await openai.createCompletion({
         model: `${currentmodel}`,
         prompt: `${message}`,
         max_tokens: 100, 
         temperature: 0,
       });
      res.json({
        message: response.data.choices[0].text,
      })
})

app.get('/models', async (req, res) => {

        const response = await openai.listEngines();
        console.log(response.data.data);
        res.json({models: response.data.data})

})


app.listen(port, () => {
    console.log(`example app listeneing at http://localhost:${port}`)
})

