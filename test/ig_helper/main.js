(function (QUnit) {

    QUnit.module("IGProviders Entities");

    QUnit.test('IGProviders.ButtonFactory should be if type object', function (assert) {
        assert.equal(typeof IGProviders.ButtonFactory, 'object', 'IGProviders.ButtonFactory should be if type object');
    });
    QUnit.test('IGProviders.Wkt should be if type function', function (assert) {
        assert.equal(typeof IGProviders.Wkt, 'function', 'IGProviders.Wkt should be if type function');
    });
    QUnit.test('IGProviders.Wicket should be if type function', function (assert) {
        assert.equal(typeof IGProviders.Wicket, 'function', 'IGProviders.Wicket should be if type function');
    });
    QUnit.test('IGProviders.WKT2Object should be if type function', function (assert) {
        assert.equal(typeof IGProviders.WKT2Object, 'function', 'IGProviders.WKT2Object should be if type function');
    });
    QUnit.test('IGProviders.loadingcircle should be if type function', function (assert) {
        assert.equal(typeof IGProviders.loadingcircle, 'function', 'IGProviders.loadingcircle should be if type function');
    });
    QUnit.test('IGProviders.colorset should be if type object', function (assert) {
        assert.equal(typeof IGProviders.colorset, 'object', 'IGProviders.colorset should be if type object');
    });
    QUnit.test('IGProviders.setModalClass should be if type function', function (assert) {
        assert.equal(typeof IGProviders.setModalClass, 'function', 'IGProviders.setModalClass should be if type function');
    });
    QUnit.test('IGProviders.isArray should be if type function', function (assert) {
        assert.equal(typeof IGProviders.isArray, 'function', 'IGProviders.isArray should be if type function');
    });
    QUnit.test('IGProviders.spaceString should be if type function', function (assert) {
        assert.equal(typeof IGProviders.spaceString, 'function', 'IGProviders.spaceString should be if type function');
    });
    QUnit.test('IGProviders.cleanString should be if type function', function (assert) {
        assert.equal(typeof IGProviders.cleanString, 'function', 'IGProviders.cleanString should be if type function');
    });
    QUnit.test('IGProviders.randomname should be if type function', function (assert) {
        assert.equal(typeof IGProviders.randomname, 'function', 'IGProviders.randomname should be if type function');
    });
    QUnit.test('IGProviders.getCookie should be if type function', function (assert) {
        assert.equal(typeof IGProviders.getCookie, 'function', 'IGProviders.getCookie should be if type function');
    });

})(QUnit);
