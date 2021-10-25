// Factory function
function Sammy(selector, initFn) {
    const mainEl = document.querySelector(selector);

    const pathCollection = [];
    let currentPath;

    // Observer pattern
    const core = {
        get(path, fn) {
            const matchFn = match(path, { decode: decodeURIComponent });
            getPathCollection.push({ path, fn, matchFn });
        },
        post(path, fn) {
            const matchFn = match(path, { decode: decodeURIComponent });
            postPathCollection.push({ path, fn, matchFn });
        },
        load(url) {
            return fetch(url).then(res => {
                return res.json();
            });
        },
        redirect(path) {
            currentPath = path;
            let params;
            const pathObj = getPathCollection.find(i => {
                const data = i.matchFn(currentPath);
                if (data) { params = data.params; }
                return !!data;
            });

            if (!pathObj) {
                console.error(`body 404 Not Found get ${currentPath}`);
                return;
            }
            pathObj.fn.call(core, { params });

            setupAnchorHandlers();
        },
        swap(htmlContent) {
            mainEl.innerHTML = htmlContent;
            setTimeout(setupAnchorHandlers, 0);
            setTimeout(() => setupFormSubmissionHandlers(this._formSubmissionHandle), 0);
        },
        _formSubmissionHandle(e) {
            e.preventDefault();
            const target = e.target;
            if (target.method.toLowerCase() !== 'post') { return; }
            let params;
            const pathObj = postPathCollection.find(i => {
              const path = target.action.replace(location.protocol + '//' + location.host, '');;
              const data = i.matchFn(path);
              if (data) { params = data.params; }
              return !!data;
            });
            if (!pathObj) {
              console.error(`body 404 Not Found post ${target.action}`);
              return;
            }
            pathObj.fn.call(core, { params, form: target });
          }
        };

    const app = {
        run(path) {
            initFn.call(core);
            core.redirect(path);
        }
    };



    return app;
}

const app = Sammy("#main", function (params) {
    this.get("/", function name(params) {
        this.swap(`Home page`);
    })

    this.get('/about', function () {
        this.swap('About page');

    })
})
app.run('/')

