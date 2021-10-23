// Factory function
function Sammy(selector, initFn) {
    const mainEl = document.querySelector(selector);

    const pathCollection = [];
    let currentPath;

    // Observer pattern
    const core = {
        get(path, fn) {
            pathCollection.push({ path, fn });
        },
        redirect(path) {
            currentPath = path;
            const pathObj = pathCollection.find(i => i.path === currentPath);
            if (!pathObj) {
                console.error(`body 404 Not found get ${currentPath}`);
                return;
            }
            pathObj.fn.call(core);
        },
        swap(htmlcontent) {
            mainEl.innerHtml = htmlcontent;
        },
    }

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

