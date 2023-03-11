using System.Diagnostics;
using System.IO;
using Dicom.Media;
using Dicom.Log;
using Dicom;
using Dicom.Imaging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using System.Text;

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

                int namingItx = 0;
                foreach (var path in seriesPaths)
                {
                    if(seriesDirPath.Contains("SUMMARY")) continue;
                    Debug.WriteLine(path);
                    SaveDicomToPng(path, seriesDirPath, namingItx);

                    namingItx++;
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

        private static void SaveDicomToPng(string dicomPath, string outputPath, int imgNumber)
        {
            var image = new DicomImage(dicomPath);
            var pixels = image.PixelData.GetFrame(0).Data;

            var pixelsRgb = new List<Rgb48>();

            for (int i = 0; i < pixels.Length; i+=2)
            {
                Int16 combinedBytes = System.BitConverter.ToInt16(pixels, i);
                UInt16 mappedBytes = (UInt16)(combinedBytes + Int16.MaxValue / 2);
                pixelsRgb.Add(new Rgb48(mappedBytes, mappedBytes, mappedBytes));
            }

            var sharpImage = Image.LoadPixelData<Rgb48>(pixelsRgb.ToArray(), image.Width, image.Height);

            SaveToDebugFile($"{outputPath}/debug.txt", image.Width, image.Height, pixelsRgb.Select(p => p.B).ToList());
            sharpImage.SaveAsBmp($"{outputPath}/kanapka{imgNumber}.bmp");
        }

        private static void SaveToDebugFile(string filePath, int imageWidth, int imageHeight, List<UInt16> pixels)
        {
            var stringBuilder = new StringBuilder();

            for (int j = 0; j < 100; j++)
            {
                for (int i = 0; i < 100; i++)
                {
                    stringBuilder.Append(pixels[(j * imageHeight) + i]);
                    stringBuilder.Append(' ');
                }
                stringBuilder.AppendLine();
            }

            File.WriteAllText(filePath, stringBuilder.ToString());
        }
    }
}

