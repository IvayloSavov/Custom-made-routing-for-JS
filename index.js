// Factory function
function Sammy(selector, initFn) {

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
            pathObj.fn();
        },
    }

    const app = {
        run(path) {
            initFn.call();
            core.redirect(path);
        }
    };



    return app;
}

const app = Sammy("#main", function (params) {

})
app.run('/')

