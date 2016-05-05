var DateChangeControl = L.Control.extend({
    options: { position: 'topright' },
    addInput: function(name, type, value, container) {
        this[name] = L.DomUtil.create('input', name, container);
        this[name].type = type;
        this[name].value = value;
    },
    addTypeSelect: function(container) {
        this.typeSelect = L.DomUtil.create('select', 'type-select', container);
        this.typeSelect.innerHTML = '<option value="">All</option>';
        this.typeSelect.innerHTML += '<option value="Ride">Ride</option>';
        this.typeSelect.innerHTML += '<option value="Run">Run</option>';
    },
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'date-change');
        this.form = L.DomUtil.create('form', 'form', container);
        this.addInput('after', 'text', '2016-01-01', this.form);
        L.DomUtil.create('br', 'linebreak', this.form);
        this.addInput('before', 'text', '2016-12-31', this.form);
        L.DomUtil.create('br', 'linebreak', this.form);
        this.addTypeSelect(this.form);
        L.DomUtil.create('br', 'linebreak', this.form);
        this.addInput('input', 'button', 'Fetch Map', this.form);
        L.DomEvent.addListener(this.input, 'click', this.updateMapHandler, this);
        return container;
    },
    updateMapHandler: function(e) {
        this.updateMap(this.after.value, this.before.value, this.typeSelect.value);
    },
    updateMap: function(after, before, type) {
    }
});

module.exports = DateChangeControl;
