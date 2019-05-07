export class ObjectKeysValueConverter {
    toView(obj) {
        return Array.from(Object.keys(obj), k => obj[k]);
    }

}
