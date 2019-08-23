# API

<TreeItem class="item" v-for="i in classifiedClasses" v-bind:item="i"/>

<script>
    const api = require('./api.json');
    const classPaths = api.children.map(child => child.name.replace(/\"/gi, ''));

    const classifiedClasses = getClassifiedClasses();

    function getClassifiedClasses() {
        let classObjs = [];
        classPaths.forEach(classPath => {
           classifyClass(classObjs, classPath);
        })

        return classObjs;
    }

    function classifyClass(classObjs, classPath) {
        let splitClassPath = classPath.split('/');

        if(splitClassPath.length > 1) {
            const firstOfSplit = splitClassPath.shift();
            const rejoinedClassPath = splitClassPath.join('/');
            if(classObjs.length > 0) {
                const classObjsNames = classObjs.map(classObj => classObj.name);
                const existingNameIndex = classObjsNames.indexOf(firstOfSplit);
                if(existingNameIndex !== -1) {
                    classifyClass(classObjs[existingNameIndex].children, rejoinedClassPath);
                    return;
                }
            }
            classObjs.push({name: firstOfSplit, children: []});
            classifyClass(classObjs[classObjs.length - 1].children, rejoinedClassPath);
        }
    }

    export default {
        computed: {
            classPaths: function () {
                return classPaths;
            },
            classifiedClasses: function () {
                return classifiedClasses;
            }
        }
    }
</script>
