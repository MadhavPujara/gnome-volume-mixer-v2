import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { VolumeMixerManager } from "./volumeMixerPopupMenu.js";

export default class ApplicationVolumeMixerExtension extends Extension {
    enable() {
        this._volumeMixer = new VolumeMixerManager(this.getSettings('org.gnome.shell.extensions.app-volume-mixer'));
    }

    disable() {
        if (this._volumeMixer) {
            this._volumeMixer.destroy();
            this._volumeMixer = null;
        }
    }
}
