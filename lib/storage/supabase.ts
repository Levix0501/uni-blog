import { IStorage } from '.';
import {
	createClient as _createClient,
	SupabaseClient
} from '@supabase/supabase-js';

const createClient = (() => {
	let supabase: SupabaseClient;
	return () =>
		(supabase ||= _createClient(
			process.env.SUPABASE_URL!,
			process.env.SUPABASE_SECRET!
		));
})();

const bucketName = process.env.SUPABASE_BUCKET_NAME!;

const storage: IStorage = {
	async save({ file, path }) {
		const supabase = createClient();
		const { data, error } = await supabase.storage
			.from(bucketName)
			.upload(path, file);
		if (error) {
			throw error;
		}

		return {
			url: data.path,
			storageType: 'supabase'
		};
	},
	async delete(path: string) {
		const supabase = createClient();
		const { data, error } = await supabase.storage
			.from(bucketName)
			.remove([path]);

		if (error) {
			throw error;
		}
	},
	getUrl(path) {
		const supabase = createClient();
		const result = supabase.storage.from(bucketName).getPublicUrl(path);
		return result.data.publicUrl;
	}
};

export default storage;
