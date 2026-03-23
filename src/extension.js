import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { VolumeMixerManager } from "./volumeMixerPopupMenu.js";

export default class ApplicationVolumeMixerExtension extends Extension {
    enable() {
        this._volumeMixer = new VolumeMixerManager(this.getSettings('net.evermiss.mymindstorm.volume-mixer'));
    }

    disable() {
        if (this._volumeMixer) {
            this._volumeMixer.destroy();
            this._volumeMixer = null;
        }
    }
}
