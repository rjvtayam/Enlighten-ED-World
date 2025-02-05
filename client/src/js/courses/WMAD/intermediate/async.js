// Callback Demo
function fetchData(callback) {
    const output = document.getElementById('callback-output');
    output.textContent = 'Fetching data with callback...';
    
    setTimeout(() => {
        const data = "Callback: Data loaded successfully!";
        output.textContent = data;
        callback(data);
    }, 1500);
}

function runCallbackDemo() {
    fetchData((data) => {
        console.log('Callback Demo:', data);
    });
}

// Promise Demo
function fetchDataPromise() {
    const output = document.getElementById('promise-output');
    output.textContent = 'Fetching data with Promise...';

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = "Promise: Data loaded successfully!";
            output.textContent = data;
            resolve(data);
        }, 1500);
    });
}

function runPromiseDemo() {
    fetchDataPromise()
        .then(data => console.log('Promise Demo:', data))
        .catch(error => console.error('Promise Error:', error));
}

// Async/Await Demo
async function fetchDataAsync() {
    const output = document.getElementById('async-await-output');
    output.textContent = 'Fetching data with Async/Await...';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        const data = await response.json();
        output.textContent = `Async/Await: ${JSON.stringify(data, null, 2)}`;
        return data;
    } catch (error) {
        output.textContent = 'Async/Await: Error fetching data';
        console.error('Async/Await Error:', error);
    }
}

async function runAsyncAwaitDemo() {
    await fetchDataAsync();
}

// Parallel Operations Demo
async function runParallelDemo() {
    const output = document.getElementById('parallel-output');
    output.textContent = 'Running parallel requests...';

    try {
        const urls = [
            'https://jsonplaceholder.typicode.com/todos/1',
            'https://jsonplaceholder.typicode.com/posts/1'
        ];

        const results = await Promise.all(
            urls.map(url => fetch(url).then(response => response.json()))
        );

        output.textContent = `Parallel Demo: ${JSON.stringify(results, null, 2)}`;
    } catch (error) {
        output.textContent = 'Parallel Demo: Error in requests';
        console.error('Parallel Demo Error:', error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Async Programming Page Loaded');
});