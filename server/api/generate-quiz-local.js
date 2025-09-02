// server/api/generate-quiz-local.js
export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event); // expects { theme: "..." }

		const response = await $fetch("http://127.0.0.1:808/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: {
				messages: [
					{
						role: "system",
						content: `You are a quiz generator. Follow these rules strictly:
						1. Generate exactly 5 multiple-choice questions about the given topic.
						2. Each question must have a clear "Question:" line.
						3. Each question must be 150 characters or less.
						4. Each question must have at least 2 answers, labeled "A.", "B.", "C.", "D.", "E.", "F." (use only the number of answers needed, minimum 2, maximum 6).
						5. Clearly mark the correct answer using the format "Answer: X" where X is the letter of the correct option.
						6. Do NOT include explanations or extra text.
						7. Separate each question and its answers with a blank line.

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
					},
					{
						role: "user",
						content: `Topic: ${body.theme}`,
					},
				],
				max_tokens: 300,
				temperature: 0.7,
			},
		});

		// Chat API returns text in response.choices[0].message.content
		const questions = response.choices?.[0]?.message?.content || "";

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
