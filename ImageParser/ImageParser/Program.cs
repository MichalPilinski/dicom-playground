using System.Diagnostics;
using System.IO;
using Dicom.Media;
using Dicom.Log;
using Dicom;
using Dicom.Imaging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace DicomDirReader
{
    public class Program
    {
        private static readonly string PathToDicomFolder = "/Users/michau/Documents/DICOMs/DICOM_PILINSKI";
        private static readonly string PathToDirFile = Path.Combine(PathToDicomFolder, "DICOMDIR");

        static void Main(string[] args)
        {
            var dicomDir = GetDicomDir();

            var study = dicomDir?.RootDirectoryRecord?.LowerLevelDirectoryRecord;

            if (study is null)
            {
                Debug.WriteLine("Could not select study!");
                throw new Exception("Could not select study!");
            }

            foreach (var series in study.LowerLevelDirectoryRecordCollection)
            {
                var seriesDirPath = CreateSeriesDirectory(series);
                var seriesPaths = MapImagesToPath(series)
                    .Select(subpath => subpath.Replace('\\', '/'))
                    .Select(subpath => Path.GetFullPath(subpath, PathToDicomFolder));

                foreach (var path in seriesPaths)
                {
                    Debug.WriteLine(path);
                    SaveDicomToPng(path, seriesDirPath);
                }
            }
        }

        private static DicomDirectory GetDicomDir()
        {
            Debug.WriteLine("Opening DicomDir file...");

            try
            {
                var dicomDirectory = DicomDirectory.Open(PathToDirFile);
                Debug.WriteLine("DicomDir opened.");

                return dicomDirectory;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Could not open DicomDir file. Error massage: {ex.Message}");
                throw;
            }
        }

        private static string CreateSeriesDirectory(DicomDirectoryRecord series)
        {
            var seriesName = series.GetSingleValue<string>(Dicom.DicomTag.SeriesDescription);
            var seriesDirName = String.Concat(seriesName.Where(c => !Char.IsWhiteSpace(c)));

            var seriesDirPath = Path.Combine(PathToDicomFolder, seriesDirName);

            Debug.WriteLine("Creating series directory...");
            try
            {
                _ = Directory.CreateDirectory(seriesDirPath);
            }
            catch
            {
                Debug.WriteLine($"Could not create directory for series: {seriesName}!");
                throw;
            }
            Debug.WriteLine("Created.");

            return seriesDirPath;
        }

        private static IEnumerable<string> MapImagesToPath(DicomDirectoryRecord series)
        {
            return series.LowerLevelDirectoryRecordCollection.Select(img => img.GetString(Dicom.DicomTag.ReferencedFileID));
        }

        private static void SaveDicomToPng(string dicomPath, string outputPath)
        {
            var image = new DicomImage(dicomPath);
            var pixels = image.PixelData.GetFrame(0).Data;

            var pixelsRgb = new List<byte>();

            for (int i = 0; i < pixels.Length; i++)
            {
                pixelsRgb.Add(pixels[i]);
                pixelsRgb.Add(pixels[i]);
                pixelsRgb.Add(pixels[i]);
            }

            var sharpImage = Image.LoadPixelData<Rgb24>(pixelsRgb.ToArray(), image.Width, image.Height);

            sharpImage.SaveAsBmp(outputPath + "/kanapka");
        }
    }
}

