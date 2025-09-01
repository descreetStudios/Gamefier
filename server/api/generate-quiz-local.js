// server/api/generate-quiz-local.js
export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event); // expects { title: "..." }

		// Request to LM Studio local API
		const response = await $fetch("http://127.0.0.1:808/v1/completions", /* change the port in settings -> server port */ {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: {
				// WARNING: Changing the prompt requires changing the output parser in app/pages/quiz-editor.vue as well, otherwise the ai output will not be used.
				// ONLY CHANGE THE PROMPT IF YOU KNOW WHAT YOU'RE DOING
				prompt: `You are a quiz generator. Generate 5 multiple-choice questions about the topic: ${body.theme}. 

					Requirements:
					1. Each question must have a clear "Question:" line.
					2. Each question must be 150 characters or less.
					3. Each question must have at least 2 answers, labeled "A.", "B.", "C.", "D.", "E.", "F." (use only the number of answers needed, minimum 2, maximum 6).
					4. Clearly mark the correct answer using the format "Answer: X" where X is the letter of the correct option.
					5. Do NOT include explanations or extra text.
					6. Separate each question and its answers with a blank line.

					Example output:

					Question: What is the capital of France?
					A. Berlin
					B. Paris
					C. Madrid
					D. Rome
					Answer: B

					Question: Which planet is known as the Red Planet?
					A. Mars
					B. Venus
					Answer: A
					`,
				max_tokens: 300, // adjust as needed
				temperature: 0.7,
			},
		});

		// LM Studio usually returns text in response.choices[0].text
		const questions = response.choices?.[0]?.text || "";

		return { questions };
	}
	catch (err) {
		console.error("LM Studio generation error:", err);
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to generate questions via LM Studio",
		});
	}
});
