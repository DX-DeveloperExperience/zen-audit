# API

{{ classPaths }}

{{ classifiedClass }}

<script>
    const api = require('./api.json');
    const classPaths = api.children.map(child => child.name.replace(/\"/gi, ''));
    const classPaths2 = [ "choice/index", "constructor/index", "errors/dir-errors/index"];

    const classifiedClasses = getClassifiedClasses();

    function getClassifiedClasses() {
        let classesObj = {};
        // classPaths2.forEach(classPath => {
        //    classesObj = classifyClass(classesObj, classPath);
        // })
        classifyClass(classesObj, "errors/dir-errors/index");
        classifyClass(classesObj, "constructor/index");


        return classesObj;
    }

    function classifyClass(classesObj, classPath) {
        console.log(classesObj)
        if(classPath !== 'index') {
            const splitClassPath = classPath.split('/');
            let newObj = classesObj[splitClassPath[0]];
            let catName = splitClassPath[0];

            if(newObj === undefined) {
                newObj = {};
                splitClassPath.shift();
                classesObj[catName] = classifyClass(newObj, splitClassPath.join('/'))
                return classesObj;
            } else {
                splitClassPath.shift();
                return classifyClass(newObj, splitClassPath.join('/'))
            }
        } else {
            return classesObj;
        }
    }

    export default {
        computed: {
            classPaths: function () {
                return classPaths;
            },
            classifiedClass: function () {
                return classifiedClasses;
            }
        }
    }
</script>