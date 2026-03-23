import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import { VolumeMixerPrefsPage } from './volumeMixerPrefsPage.js';

export default class ApplicationVolumeMixerPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window.add(new VolumeMixerPrefsPage(this.getSettings('io.github.madhavpujara.app-volume-mixer')));
    }
}
