## 1. AI Models Used 

Model 1: GPT 6 Luna 

Model 2: Gemini 3.8 Medium 

Model 3: Opus 4.6 Thinking 

Model 4: Mistal Medium 3.5 

## 2. Prompt Used 

Generate a single page website for a company that provide FDE services 

## 3. Code Quality Observation 

**1** is the lowest value and **5** is the highest value given to each model’s performance. **Higher is better** 

|**Area**|**Model 1**|**Model 2**|**Model 3**|**Model 4**|
|---|---|---|---|---|
|Code structure|4|2|3|4|
|Readability|4|2|3|4|
|Component design |3|5|4|3|
|Documentation|2|4|4|4|
|Error handling|5|5|5|5|
|Average (Higher<br>is Better)|3.6|3.6|3.8|4|



#### Model 1: GPT 6 Luna 

519 Lines of code for HTML, CSS and JavaScript in a single index.html file. Functional and Looks good No questions asked 

#### Model 2: Gemini 3.8 Medium 

Generated Images, Sperate Index.html style.css app.js, 1415 Lines of HTML, 843 line of JavaScript, 2674 CSS Functional and Most sophisticated page No questions asked All section in the HML file is marked. 

#### Model 3: Opus 4.6 Thinking 

Sperate Index.html style.css app.js, 469 Lines of HTML, 214 line of JavaScript , 1391 CSS Functional and Looks good All section in the HML file is marked. 

Questions Asked: 

What does FDE stand for in your company? 

#### Model 4: Mistal Medium 3.5 

668 Lines of code for HTML, CSS and JavaScript in a single index.html file. Functional and Looks good.
All section in the HML file is marked. 

Questions Asked: 

What does FDE stand for in your company's services? 

Do you have a company name to use, or should I create a placeholder brand? 

## 4. AI Hallucination Observation 

### **There was no observable Hallucination/Misinformation.** 

Only Mistral Medium 3. asked questions; What does FDE stand for in your company's services? Do you have a company name to use, or should I create a placeholder brand? 

Other Models did not ask any questions and generated the company names itself. 

## 5. Final Decision 

### *Hypothesis* 

The model should be capable of generating a functional website based on a user's prompt. Before implementation, it should identify and ask all necessary questions to clarify the user's requirements, preferences, and constraints. It should then use the collected inputs to implement the website accordingly. 

The generated implementation should prioritize minimal, clean, and human-readable code, avoiding unnecessary complexity, redundant components, and excessive code. The objective is to produce the smallest practical codebase that remains functional, understandable, maintainable, and easy for humans to modify. 

### Final Decision Based on the hypothesis 

Mistral Medium 3.5 asked relevant questions to clarify the prompt and requirements before implementation. The generated content was closely aligned with the prompt and produced a good visual result. With only **668 lines of code** in a simple single-file structure, the implementation is easy to understand, functional, and maintainable. Overall, it aligns well with the hypothesis of producing a **minimal, clean, human-readable, functional, and maintainable implementation** . 

