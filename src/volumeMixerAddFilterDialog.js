import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk?version=4.0';
import GObject from 'gi://GObject';

export const VolumeMixerAddFilterDialog = GObject.registerClass({
    GTypeName: 'VolumeMixerAddFilterDialog',
    Signals: {
        'filter-added': { param_types: [GObject.TYPE_STRING] },
    },
}, class VolumeMixerAddFilterDialog extends Adw.AlertDialog {
    appNameEntry;
    filterListData;

    constructor(filterListData) {
        super({
            heading: 'Add Filtered Application',
            close_response: 'cancel',
        });

        this.filterListData = filterListData;

        this.add_response('cancel', 'Cancel');
        this.add_response('add', 'Add');
        this.set_response_appearance('add', Adw.ResponseAppearance.SUGGESTED);
        this.set_response_enabled('add', false);

        this.appNameEntry = new Gtk.Entry();
        this.appNameEntry.connect('activate', () => {
            if (this.checkInputValid()) {
                this.response('add');
            }
        });
        this.appNameEntry.connect('changed', () => {
            this.set_response_enabled('add', this.checkInputValid());
        });

        const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 10 });
        box.append(new Gtk.Label({ label: 'Application name', halign: Gtk.Align.START }));
        box.append(this.appNameEntry);
        this.set_extra_child(box);
    }

    checkInputValid() {
        return this.appNameEntry.text.length > 0
            && this.filterListData.indexOf(this.appNameEntry.text) === -1;
    }
});
