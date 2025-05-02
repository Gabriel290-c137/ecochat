import { Injectable } from '@angular/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { FilePhoto } from '../interfaces/filephoto.interface';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  public files: FilePhoto[] = [];

  constructor() {}

  public async pickFileFromDevice() {
    try {
      const result = await FilePicker.pickFiles({
        readData: true,
        types: ['image/*']
      });

      const file = result.files[0];

      if (!file || !file.data) {
        return;
      }

      const base64data = file.data.split(',')[1];

      this.files.unshift({
        filepath: file.name || 'file.jpg',
        webviewPath: file.data,
        base64: base64data
      });
    } catch (error) {
      console.warn('Error al seleccionar archivo', error);
    }
  }
}
