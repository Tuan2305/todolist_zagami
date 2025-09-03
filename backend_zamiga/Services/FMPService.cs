using System.Text.Json;
using backend_zamiga.Interfaces;
using backend_zamiga.Models;

namespace backend_zamiga.Services
{
    public class FMPService : IFMPService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        
        public FMPService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<Student?> FindStudentByIdAsync(int id)
        {
            try
            {
                string apiKey = _config["FMPKey"] ?? throw new ArgumentNullException("FMP API key not found");
                string url = $"https://financialmodelingprep.com/api/v3/profile/{id}?apikey={apiKey}";
                
                var response = await _httpClient.GetAsync(url);
                
                if (!response.IsSuccessStatusCode)
                    return null;
                    
                var content = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<List<Student>>(content,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    
                return result?.FirstOrDefault();
            }
            catch (Exception)
            {
                return null;
            }
        }

    
    }
}