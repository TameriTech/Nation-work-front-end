#!/bin/bash

# Script de création de la structure API Admin
# Chemin de base: src/app/api

BASE_PATH="src/app/api/admin"

echo "🚀 Création de la structure API Admin..."

# Fonction pour créer un fichier avec contenu
create_file() {
    local file_path="$1"
    local content="$2"
    
    # Créer le dossier parent si nécessaire
    mkdir -p "$(dirname "$file_path")"
    
    # Créer le fichier avec le contenu
    echo "$content" > "$file_path"
    echo "✅ Créé: $file_path"
}

# Fonction pour créer un fichier route.ts basique
create_route_file() {
    local file_path="$1"
    local method="$2"
    local endpoint="$3"
    
    if [[ "$method" == "GET" ]]; then
        create_file "$file_path" "import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('$endpoint', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"
    elif [[ "$method" == "POST" ]]; then
        create_file "$file_path" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('$endpoint', {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur', field: error.field },
      { status: error.status || 500 }
    );
  }
}"
    fi
}

# Création des dossiers principaux
mkdir -p "$BASE_PATH"/{dashboard,users,services,payments,disputes,settings,support,notifications}

echo "📂 Dossiers principaux créés"

# ============================================
# DASHBOARD
# ============================================

create_route_file "$BASE_PATH/dashboard/stats/route.ts" "GET" "/admin/dashboard/stats"
create_route_file "$BASE_PATH/dashboard/activities/route.ts" "GET" "/admin/dashboard/activities"
create_route_file "$BASE_PATH/dashboard/charts/route.ts" "GET" "/admin/dashboard/charts"
create_route_file "$BASE_PATH/dashboard/summary/route.ts" "GET" "/admin/dashboard/summary"

# ============================================
# USERS
# ============================================

# Users list
create_file "$BASE_PATH/users/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(req.url);
    
    const params = new URLSearchParams();
    const filters = ['role', 'status', 'search', 'page', 'per_page'];
    filters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) params.append(filter, value);
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/users?\${params.toString()}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# User by ID
create_file "$BASE_PATH/users/[userId]/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { userId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/users/\${userId}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { userId } = await params;
    const { searchParams } = new URL(req.url);
    const permanent = searchParams.get('permanent') === 'true';

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/users/\${userId}?permanent=\${permanent}\`, {
      method: 'DELETE',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Suspend user
create_file "$BASE_PATH/users/[userId]/suspend/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { userId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/users/\${userId}/suspend\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur', field: error.field },
      { status: error.status || 500 }
    );
  }
}"

# Activate user
create_file "$BASE_PATH/users/[userId]/activate/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { userId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/users/\${userId}/activate\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Change role
create_file "$BASE_PATH/users/[userId]/role/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { userId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/users/\${userId}/role\`, {
      method: 'PATCH',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Send email
create_file "$BASE_PATH/users/[userId]/email/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { userId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/users/\${userId}/email\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# User history
create_file "$BASE_PATH/users/[userId]/history/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { userId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/users/\${userId}/history\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Pending verifications
create_file "$BASE_PATH/users/verifications/pending/route.ts" "import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/users/verifications/pending', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Approve verification
create_file "$BASE_PATH/users/verifications/[verificationId]/approve/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { verificationId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { verificationId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/users/verifications/\${verificationId}/approve\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Reject verification
create_file "$BASE_PATH/users/verifications/[verificationId]/reject/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { verificationId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { verificationId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/users/verifications/\${verificationId}/reject\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur', field: error.field },
      { status: error.status || 500 }
    );
  }
}"

# ============================================
# SERVICES
# ============================================

# Services list
create_file "$BASE_PATH/services/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(req.url);
    
    const params = new URLSearchParams();
    const filters = ['status', 'category', 'client_id', 'freelancer_id', 'date_from', 'date_to', 'budget_min', 'budget_max', 'search', 'page', 'per_page'];
    filters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) params.append(filter, value);
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/services?\${params.toString()}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Services stats
create_file "$BASE_PATH/services/stats/route.ts" "import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/services/stats', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Service by ID
create_file "$BASE_PATH/services/[serviceId]/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { serviceId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/services/\${serviceId}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Update service status
create_file "$BASE_PATH/services/[serviceId]/status/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { serviceId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/services/\${serviceId}/status\`, {
      method: 'PATCH',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Cancel service
create_file "$BASE_PATH/services/[serviceId]/cancel/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { serviceId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/services/\${serviceId}/cancel\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur', field: error.field },
      { status: error.status || 500 }
    );
  }
}"

# Delete service
create_file "$BASE_PATH/services/[serviceId]/delete/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { serviceId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/services/\${serviceId}/delete\`, {
      method: 'DELETE',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# ============================================
# CATEGORIES
# ============================================

# Categories list
create_file "$BASE_PATH/services/categories/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/services/categories', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/services/categories', {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur', field: error.field },
      { status: error.status || 500 }
    );
  }
}"

# Category by ID
create_file "$BASE_PATH/services/categories/[categoryId]/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function PUT(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { categoryId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/services/categories/\${categoryId}\`, {
      method: 'PUT',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { categoryId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/services/categories/\${categoryId}\`, {
      method: 'DELETE',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Toggle category status
create_file "$BASE_PATH/services/categories/[categoryId]/toggle/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { categoryId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/services/categories/\${categoryId}/toggle\`, {
      method: 'PATCH',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# ============================================
# PAYMENTS
# ============================================

# Payment summary
create_file "$BASE_PATH/payments/summary/route.ts" "import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/payments/summary', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Transactions list
create_file "$BASE_PATH/payments/transactions/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(req.url);
    
    const params = new URLSearchParams();
    const filters = ['status', 'client_id', 'freelancer_id', 'date_from', 'date_to', 'page', 'per_page'];
    filters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) params.append(filter, value);
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/payments/transactions?\${params.toString()}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Transaction by ID
create_file "$BASE_PATH/payments/transactions/[transactionId]/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { transactionId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/payments/transactions/\${transactionId}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Mark payment as paid
create_file "$BASE_PATH/payments/transactions/[transactionId]/mark-paid/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { transactionId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/payments/transactions/\${transactionId}/mark-paid\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body || {}),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Refund transaction
create_file "$BASE_PATH/payments/transactions/[transactionId]/refund/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { transactionId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/payments/transactions/\${transactionId}/refund\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur', field: error.field },
      { status: error.status || 500 }
    );
  }
}"

# Generate invoice
create_file "$BASE_PATH/payments/transactions/[transactionId]/invoice/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { transactionId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const response = await apiClient(\`/admin/payments/transactions/\${transactionId}/invoice\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    // Si l'API externe retourne un PDF
    if (response instanceof Blob) {
      return new NextResponse(response, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': \`attachment; filename="facture-\${transactionId}.pdf"\`,
        },
      });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Payouts list
create_file "$BASE_PATH/payments/payouts/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(req.url);
    
    const params = new URLSearchParams();
    const filters = ['status', 'freelancer_id', 'date_from', 'date_to', 'page', 'per_page'];
    filters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) params.append(filter, value);
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/payments/payouts?\${params.toString()}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Process payout
create_file "$BASE_PATH/payments/payouts/[payoutId]/process/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { payoutId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { payoutId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/payments/payouts/\${payoutId}/process\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Export transactions
create_file "$BASE_PATH/payments/export/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(req.url);
    
    const params = new URLSearchParams(searchParams);

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const response = await apiClient(\`/admin/payments/export?\${params.toString()}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    // Si l'API externe retourne un CSV
    if (response instanceof Blob) {
      return new NextResponse(response, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="transactions.csv"',
        },
      });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# ============================================
# DISPUTES
# ============================================

# Disputes list
create_file "$BASE_PATH/disputes/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(req.url);
    
    const params = new URLSearchParams();
    const filters = ['status', 'priority', 'opened_by', 'date_from', 'date_to', 'assigned_to', 'page', 'per_page'];
    filters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) params.append(filter, value);
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/disputes?\${params.toString()}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Dispute stats
create_file "$BASE_PATH/disputes/stats/route.ts" "import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/disputes/stats', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Dispute by ID
create_file "$BASE_PATH/disputes/[disputeId]/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: { disputeId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { disputeId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/disputes/\${disputeId}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Assign dispute
create_file "$BASE_PATH/disputes/[disputeId]/assign/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { disputeId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { disputeId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/disputes/\${disputeId}/assign\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Add dispute message
create_file "$BASE_PATH/disputes/[disputeId]/messages/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { disputeId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { disputeId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/disputes/\${disputeId}/messages\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Resolve dispute
create_file "$BASE_PATH/disputes/[disputeId]/resolve/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { disputeId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { disputeId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/disputes/\${disputeId}/resolve\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur', field: error.field },
      { status: error.status || 500 }
    );
  }
}"

# Reject dispute
create_file "$BASE_PATH/disputes/[disputeId]/reject/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib-api';

export async function POST(
  req: NextRequest,
  { params }: { params: { disputeId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { disputeId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/disputes/\${disputeId}/reject\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Escalate dispute
create_file "$BASE_PATH/disputes/[disputeId]/escalate/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { disputeId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { disputeId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/disputes/\${disputeId}/escalate\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Dispute history
create_file "$BASE_PATH/disputes/[disputeId]/history/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: { disputeId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { disputeId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/disputes/\${disputeId}/history\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# ============================================
# SETTINGS
# ============================================

# General settings
create_file "$BASE_PATH/settings/general/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/settings/general', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/settings/general', {
      method: 'PUT',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur', field: error.field },
      { status: error.status || 500 }
    );
  }
}"

# Fee settings
create_file "$BASE_PATH/settings/fees/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/settings/fees', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/settings/fees', {
      method: 'PUT',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur', field: error.field },
      { status: error.status || 500 }
    );
  }
}"

# Timings settings
create_file "$BASE_PATH/settings/timings/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/settings/timings', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/settings/timings', {
      method: 'PUT',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Thresholds settings
create_file "$BASE_PATH/settings/thresholds/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/settings/thresholds', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/settings/thresholds', {
      method: 'PUT',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Admins list
create_file "$BASE_PATH/settings/admins/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/settings/admins', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/settings/admins', {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur', field: error.field },
      { status: error.status || 500 }
    );
  }
}"

# Admin by ID
create_file "$BASE_PATH/settings/admins/[adminId]/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function PUT(
  req: NextRequest,
  { params }: { params: { adminId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { adminId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/settings/admins/\${adminId}\`, {
      method: 'PUT',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { adminId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { adminId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/settings/admins/\${adminId}\`, {
      method: 'DELETE',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Activity logs
create_file "$BASE_PATH/settings/logs/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(req.url);
    
    const params = new URLSearchParams();
    const filters = ['admin_id', 'action', 'date_from', 'date_to', 'page', 'per_page'];
    filters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) params.append(filter, value);
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/settings/logs?\${params.toString()}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Maintenance mode
create_file "$BASE_PATH/settings/maintenance/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/settings/maintenance', {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Email templates
create_file "$BASE_PATH/settings/email-templates/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/settings/email-templates', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Email template by ID
create_file "$BASE_PATH/settings/email-templates/[templateId]/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function PUT(
  req: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { templateId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/settings/email-templates/\${templateId}\`, {
      method: 'PUT',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Test email template
create_file "$BASE_PATH/settings/email-templates/[templateId]/test/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { templateId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/settings/email-templates/\${templateId}/test\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# ============================================
# SUPPORT
# ============================================

# Support tickets
create_file "$BASE_PATH/support/tickets/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(req.url);
    
    const params = new URLSearchParams();
    const filters = ['status', 'priority', 'user_id', 'assigned_to', 'date_from', 'date_to', 'page', 'per_page'];
    filters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) params.append(filter, value);
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/support/tickets?\${params.toString()}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Support stats
create_file "$BASE_PATH/support/tickets/stats/route.ts" "import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/support/tickets/stats', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Ticket by ID
create_file "$BASE_PATH/support/tickets/[ticketId]/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { ticketId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/support/tickets/\${ticketId}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Assign ticket
create_file "$BASE_PATH/support/tickets/[ticketId]/assign/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { ticketId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/support/tickets/\${ticketId}/assign\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Reply to ticket
create_file "$BASE_PATH/support/tickets/[ticketId]/reply/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { ticketId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/support/tickets/\${ticketId}/reply\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Close ticket
create_file "$BASE_PATH/support/tickets/[ticketId]/close/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { ticketId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/support/tickets/\${ticketId}/close\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Reopen ticket
create_file "$BASE_PATH/support/tickets/[ticketId]/reopen/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { ticketId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/support/tickets/\${ticketId}/reopen\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# ============================================
# NOTIFICATIONS
# ============================================

# Notifications list
create_file "$BASE_PATH/notifications/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { searchParams } = new URL(req.url);
    const include_read = searchParams.get('include_read') === 'true';

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/notifications?include_read=\${include_read}\`, {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Unread count
create_file "$BASE_PATH/notifications/unread-count/route.ts" "import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/notifications/unread-count', {
      method: 'GET',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Mark notification as read
create_file "$BASE_PATH/notifications/[notificationId]/read/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { notificationId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/notifications/\${notificationId}/read\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Delete notification
create_file "$BASE_PATH/notifications/[notificationId]/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { notificationId } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/notifications/\${notificationId}\`, {
      method: 'DELETE',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Mark all as read
create_file "$BASE_PATH/notifications/read-all/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST() {
  try {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/notifications/read-all', {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Send notification to all admins
create_file "$BASE_PATH/notifications/send/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient('/admin/notifications/send-to-all', {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

# Send notification to specific admin
create_file "$BASE_PATH/notifications/send/[adminId]/route.ts" "import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client';

export async function POST(
  req: NextRequest,
  { params }: { params: { adminId: string } }
) {
  try {
    const token = (await cookies()).get('access_token')?.value;
    const { adminId } = await params;
    const body = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const data = await apiClient(\`/admin/notifications/send/\${adminId}\`, {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: error.status || 500 }
    );
  }
}"

echo ""
echo "🎉 Structure API Admin créée avec succès dans $BASE_PATH"
echo "📊 Total: 78 fichiers route.ts créés"