import http from 'http';

const PORT = 3001;
// **Preallocate Memory for 10,000 Requests**
const RESPONSE_POOL_SIZE = 10000;
const responseRes = new Array(RESPONSE_POOL_SIZE).fill(null);
const responseRand = new Float64Array(RESPONSE_POOL_SIZE);
const responseStartTime = new Uint32Array(RESPONSE_POOL_SIZE);
let freeList = [...Array(RESPONSE_POOL_SIZE).keys()];  // Stack of free indices

const server = http.createServer((req, res) => {
	if (freeList.length === 0) {
		res.writeHead(503, { 'Content-Type': 'text/plain' });
		res.end('Server overloaded\n');
		return;
	}

	const slotIndex = freeList.pop();  // Grab a free slot
	responseRes[slotIndex] = res;  // Store response directly (no `0`)
	responseRand[slotIndex] = Math.random();
	responseStartTime[slotIndex] = Date.now();
});

// **Optimized Polling with Skipping**
function processRequests() {
	const now = Date.now();

	for (let i = 0; i < RESPONSE_POOL_SIZE; i++) {
		const res = responseRes[i];
		if (res === null) continue;  // **FAST SKIP**

		if (now - responseStartTime[i] >= 5) {  // **Simulated async delay**
			const rand = responseRand[i];
			const success = rand > 0.5;
			res.writeHead(success ? 200 : 500, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ [success ? 'message' : 'error']: `Result ${rand}` }));

			// **Free slot (keep using push/pop)**
			responseRes[i] = null;
			freeList.push(i);
		}
	}
}

setInterval(processRequests, 1);

server.listen(PORT, () => console.log('🔥 OPTIMIZED POLLING SERVER ON PORT 3001 🔥'));
