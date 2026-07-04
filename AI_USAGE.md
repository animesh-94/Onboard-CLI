# AI Usage Guidelines

At Onboard-CLI, we recognize the incredible utility of Large Language Models (LLMs) and AI-assisted coding tools. We encourage developers to leverage these tools to boost productivity, write boilerplate, and brainstorm solutions. 

However, to maintain the integrity, security, and quality of our open-source project, we have established the following guidelines for using AI when contributing.

## 1. Accountability
**You are fully responsible for the code you submit.** 
- Do not blindly copy and paste AI-generated code.
- You must be able to explain how the code works and why it is the best approach for the problem.
- If a bug is introduced via AI-generated code, you are responsible for fixing it.

## 2. Code Quality and Testing
- AI tools can sometimes produce code that is subtly incorrect, inefficient, or outdated.
- All AI-generated code must be thoroughly reviewed and tested locally before being submitted in a Pull Request.
- Ensure that the code adheres to our project's style guides (e.g., idiomatic Go, standard React practices).

## 3. Security and Vulnerabilities
- Always scrutinize AI-generated code for potential security vulnerabilities.
- LLMs may suggest insecure practices or use outdated libraries. Cross-reference generated solutions with official documentation and modern security standards.

## 4. Licensing and Copyright
- Ensure that the AI tool you are using does not copy code verbatim from other projects with incompatible licenses (e.g., GPL code into our MIT-licensed project).
- You are responsible for ensuring that the code you submit does not infringe on third-party intellectual property.

## 5. Transparency in PRs
- While not strictly mandatory, we appreciate transparency. If a substantial portion of a complex feature, architectural design, or algorithm was designed with AI assistance, please mention it in your Pull Request description.
- Example: *"Note: The regex parsing logic in this PR was initially drafted with ChatGPT and subsequently refined and tested."*

## 6. Documentation and Comments
- AI is excellent for generating documentation, docstrings, and comments. 
- Please proofread all AI-generated text. Ensure it is accurate, concise, and matches the tone of the rest of the project's documentation. Avoid overly verbose or generic AI-speak.

---
By embracing these tools responsibly, we can build a better Onboard-CLI faster and more efficiently. Happy coding!
