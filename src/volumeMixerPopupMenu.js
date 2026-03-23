import Gio from 'gi://Gio';
import Gvc from 'gi://Gvc';
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Volume from 'resource:///org/gnome/shell/ui/status/volume.js';
import { ApplicationStreamSlider } from "./applicationStreamSlider.js";

const { Settings } = Gio;
const { MixerSinkInput } = Gvc;

export class VolumeMixerManager {
    constructor(settings) {
        this._applicationStreams = {};
        this.settings = settings;

        this._control = Volume.getMixerControl();
        
        this._volumeSlider = Main.panel.statusArea.quickSettings._volumeOutput._output;
        this._mixerSection = new PopupMenu.PopupMenuSection();
        this._separator = new PopupMenu.PopupSeparatorMenuItem();
        
        this._volumeSlider.menu.addMenuItem(this._separator);
        this._volumeSlider.menu.addMenuItem(this._mixerSection);

        this._updateStreams();

        this._streamAddedEventId = this._control.connect("stream-added", this._streamAdded.bind(this));
        this._streamRemovedEventId = this._control.connect("stream-removed", this._streamRemoved.bind(this));
        this._settingsChangedId = this.settings.connect('changed', () => this._updateStreams());
    }

    _streamAdded(control, id) {
        if (id in this._applicationStreams) {
            return;
        }

        const stream = control.lookup_stream_id(id);

        if (stream.is_event_stream || !(stream instanceof MixerSinkInput)) {
            return;
        }

        if (this._filterMode === "block") {
            if (this._filteredApps.indexOf(stream.get_name()) !== -1) {
                return;
            }
        } else if (this._filterMode === "allow") {
            if (this._filteredApps.indexOf(stream.get_name()) === -1) {
                return;
            }
        }

        const slider = new ApplicationStreamSlider(stream, { showDesc: this._showStreamDesc, showIcon: this._showStreamIcon });
        
        const item = new PopupMenu.PopupBaseMenuItem({ reactive: false });
        
        const vbox = new St.BoxLayout({ vertical: true, x_expand: true });
        
        const name = stream.get_name();
        const description = stream.get_description();
        if (name || description) {
            const text = name && this._showStreamDesc ? `${name} - ${description}` : (name || description);
            const label = new St.Label({
                text: text,
                y_align: 2,
            });
            // Add some margin so it doesn't stick directly to the slider
            label.margin_bottom = 6;
            // Align with slider icon
            label.margin_start = 12;
            vbox.add_child(label);
        }
        
        vbox.add_child(slider);
        item.add_child(vbox);
        
        this._applicationStreams[id] = { slider, item };
        this._mixerSection.addMenuItem(item);
    }

    _streamRemoved(control, id) {
        if (id in this._applicationStreams) {
            this._applicationStreams[id].item.destroy();
            delete this._applicationStreams[id];
        }
    }

    _updateStreams() {
        for (const id in this._applicationStreams) {
            this._applicationStreams[id].item.destroy();
            delete this._applicationStreams[id];
        }

        this._filteredApps = this.settings.get_strv("filtered-apps");
        this._filterMode = this.settings.get_string("filter-mode");
        this._showStreamDesc = this.settings.get_boolean("show-description");
        this._showStreamIcon = this.settings.get_boolean("show-icon");

        for (const stream of this._control.get_streams()) {
            this._streamAdded(this._control, stream.get_id());
        }
    }

    destroy() {
        this._control.disconnect(this._streamAddedEventId);
        this._control.disconnect(this._streamRemovedEventId);
        this.settings.disconnect(this._settingsChangedId);
        
        for (const id in this._applicationStreams) {
            this._applicationStreams[id].item.destroy();
            delete this._applicationStreams[id];
        }
        
        this._mixerSection.destroy();
        this._separator.destroy();
    }
};
