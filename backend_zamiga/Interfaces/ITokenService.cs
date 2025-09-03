using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend_zamiga.Models;

namespace backend_zamiga.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}