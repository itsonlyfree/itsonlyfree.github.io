document.addEventListener('DOMContentLoaded', function() {
    const query = new URLSearchParams(window.location.search).get('query');
    if (query) {
        document.getElementById('query').value = query;
        performSearch(query);
    }

    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.getElementById('query').value;
        performSearch(query);
    });

    function performSearch(query) {
        const csrf_token = document.getElementById('csrf_token').value;
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = `https://fapello.com/search/${encodeURIComponent(query)}`;
        const url = proxyUrl + targetUrl;

        fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'JavaScript',
                'X-CSRF-Token': csrf_token
            }
        })
        .then(response => {
            if (response.status === 403) {
                throw new Error('CORS Access Forbidden');
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const resultElements = doc.querySelectorAll('.bg-red-400');

            const results = Array.from(resultElements).map(element => {
                const aTag = element.querySelector('a');
                const href = aTag ? aTag.getAttribute('href') : '';
                const imgTag = aTag ? aTag.querySelector('img') : null;
                const src = imgTag ? imgTag.getAttribute('src') : '';
                const nameDiv = element.querySelector('div:last-child');
                const name = nameDiv ? nameDiv.textContent : '';
                return { href, src, name };
            });

            const resultsContainer = document.getElementById('search-results');
            resultsContainer.innerHTML = '';

            if (results.length > 0) {
                results.forEach(result => {
                    const resultHtml = `
                        <div class="col-6 col-md-3 mb-3">
                            <a href="index.html?url=${encodeURIComponent(result.href)}">
                                <div class="rounded" style="background-image: url(${result.src}); background-position: center; background-size: cover; height: 200px;"></div>
                                <p class="text-dark">${result.name}</p>
                            </a>
                        </div>
                    `;
                    resultsContainer.insertAdjacentHTML('beforeend', resultHtml);
                });
            } else {
                resultsContainer.insertAdjacentHTML('beforeend', '<p>Não encontramos resultados, (ainda).</p>');
            }
        })
        .catch(error => {
            console.error('Erro na busca:', error);
            const resultsContainer = document.getElementById('search-results');
            resultsContainer.innerHTML = '<p>Erro na busca. Por favor, <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">clique aqui</a> e clique no botão "Request temporary access to the demo server", depois retorne e tente novamente.</p>';
        });
    }
});
