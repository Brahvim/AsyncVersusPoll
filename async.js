import http from 'http';

const PORT = 2999;
const server = http.createServer((req, res) => {
	const rand = Math.random();  // Introduce a branch

	if (rand > 0.5) {
		setTimeout(() => {
			const payload = { message: `Hello, world! ${rand}` };  // Allocates object
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(payload));  // Closure forces V8 to keep `rand`
		}, 5);
	} else {
		setTimeout(() => {
			const payload = { error: `Something went wrong ${rand}` };
			res.writeHead(500, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(payload));
		}, 5);
	}
});

server.listen(PORT, () => console.log('Callback-based server running on port 3000'));
