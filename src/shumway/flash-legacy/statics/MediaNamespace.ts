module Shumway.flash.system {
	export class MediaNamespace {
		constructor() {
			this.ID3Info = new LegacyClass(media.ID3Info);
			this.Sound = new LegacyClass(media.Sound);
			this.SoundChannel = new LegacyClass(media.SoundChannel);
			this.SoundTransform = new LegacyClass(media.SoundTransform);
			this.Video = new LegacyClass(media.Video);
		}

		ID3Info: LegacyClass<media.ID3Info>;
		Sound: LegacyClass<media.Sound>;
		SoundChannel: LegacyClass<media.SoundChannel>;
		SoundTransform: LegacyClass<media.SoundTransform>;
		Video: LegacyClass<media.Video>;
	}
}