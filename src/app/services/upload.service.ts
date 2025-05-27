import { UserPhoto } from '../interfaces/photo.interface';
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public upload: UserPhoto[] = [];
  constructor() { }

  public async addNewToUpload() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
      quality: 100
    });

    // Guardar foto en base64
    this.upload.unshift({
      filepath: "local-photo.jpg",
      webviewPath: `data:image/jpeg;base64,${capturedPhoto.base64String}`,
      base64: capturedPhoto.base64String
    });
  }
}
