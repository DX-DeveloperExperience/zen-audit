---
sidebar: false
---

# API

<TreeItem class="item" v-for="i in classifiedClasses" v-bind:item="i"/>

<script>
    const api = require('./api.json');
    const classObjs = api.children.map(child => { return { classPath: child.name.replace(/\"/gi, ''), content: child}; });
    console.log(classObjs)
    const classifiedClasses = getClassifiedClasses();

    function getClassifiedClasses() {
        let classified = [];
        classObjs.forEach(classObj => {
           classifyClass(classified, classObj);
        })

        return classified;
    }

    function classifyClass(classifieds, classObj) {
        let splitClassPath = classObj.classPath.split('/');

        if(splitClassPath.length > 1) {
            const firstOfSplit = splitClassPath.shift();
            classObj.classPath = splitClassPath.join('/');
            if(classifieds.length > 0) {
                const classifiedNames = classifieds.map(classified => classified.name);
                const existingNameIndex = classifiedNames.indexOf(firstOfSplit);
                if(existingNameIndex !== -1) {
                    classifyClass(classifieds[existingNameIndex].children, classObj);
                    return;
                }
            }
            classifieds.push({name: firstOfSplit, children: [], content: classObj.content});
            classifyClass(classifieds[classifieds.length - 1].children, classObj);
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
