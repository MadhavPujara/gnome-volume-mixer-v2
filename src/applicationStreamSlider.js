import St from 'gi://St';
import GObject from 'gi://GObject';
import * as Volume from 'resource:///org/gnome/shell/ui/status/volume.js';
import { QuickSlider } from 'resource:///org/gnome/shell/ui/quickSettings.js';

const { BoxLayout, Label } = St;

export const ApplicationStreamSlider = GObject.registerClass(
class ApplicationStreamSlider extends QuickSlider {
    _init(stream, opts) {
        super._init({
            icon_reactive: true,
        });

        this._control = Volume.getMixerControl();
        this._stream = stream;

        if (opts.showIcon) {
            this.gicon = stream.get_gicon();
        }

        this._updateSlider();

        // Connect events
        this._sliderChangedId = this.slider.connect('notify::value', this._sliderChanged.bind(this));

        this.connect('icon-clicked', () => {
            if (!this._stream) return;
            const isMuted = this._stream.is_muted;
            this._stream.change_is_muted(!isMuted);
        });

        // Listen for volume changes
        this._stream.connectObject(
            'notify::is-muted', this._updateSlider.bind(this),
            'notify::volume', this._updateSlider.bind(this),
            this
        );
    }

    _updateSlider() {
        this.slider.block_signal_handler(this._sliderChangedId);
        this.slider.value = this._stream.is_muted ? 0 : (this._stream.volume / this._control.get_vol_max_norm());
        this.slider.unblock_signal_handler(this._sliderChangedId);
    }

    _sliderChanged() {
        if (!this._stream) return;
        const volume = this.slider.value * this._control.get_vol_max_norm();
        if (volume < 1) {
            this._stream.volume = 0;
            if (!this._stream.is_muted) this._stream.change_is_muted(true);
        } else {
            this._stream.volume = volume;
            if (this._stream.is_muted) this._stream.change_is_muted(false);
        }
        this._stream.push_volume();
    }

    destroy() {
        if (this._stream) {
            this._stream.disconnectObject(this);
            this._stream = null;
        }
        super.destroy();
    }
});
